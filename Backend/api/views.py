from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import authenticate, login
from .models import User, Ticket, Payment, Flight
from .serializers import FlightSerializer, UserSerializer, TicketSerializer, PaymentSerializer

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        print("sessionkey0: " + str(request.session.session_key))
        print("user existance:" + str(user))
        print("user status:" + str(user.is_authenticated))
        if user:
            login(request, user)
            request.session.save()

            print("sessionkey1: " + str(request.session.session_key))
            return Response({'message': 'Logged in successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserTickets(APIView):
    def get(self, request):
        print("sessionkey: " + str(request.session.session_key))
        print("user status:" + str(request.user.is_authenticated))
        print("user existance:" + str(request.user))
        if not request.user.is_authenticated:
            return Response({'error': 'User not logged in or not found'}, status=status.HTTP_403_FORBIDDEN)
        tickets = Ticket.objects.filter(user=request.user)
        serializer = TicketSerializer(tickets, many=True)    
        return Response(serializer.data)
    
class TicketDetails(APIView):
    def get(self, request, pk):
        ticket = get_object_or_404(Ticket, ticket_id=pk)
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        ticket = get_object_or_404(Ticket, ticket_id=pk)
        serializer = TicketSerializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        ticket = get_object_or_404(Ticket, ticket_id=pk)
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request):
    if not request.user.is_authenticated:
        return Response({'error': 'User not logged in or not found'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserSerializer(request.user, data=request.data or None, partial=True)
    if request.method == 'GET':
        return Response(serializer.data)
    elif request.method == 'PUT':
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'PUT', 'DELETE'])
def flight_detail(request, pk):
    flight = get_object_or_404(Flight, pk=pk)
    if request.method == 'GET':
        serializer = FlightSerializer(flight)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = FlightSerializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        flight.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
def flight_list(request):
    if request.method == 'GET': 
        flights = Flight.objects.all()
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)
    elif request.method == 'POST': 
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
@api_view(['POST'])
def make_payment(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not logged in or not found'}, status=status.HTTP_403_FORBIDDEN)

    flight = get_object_or_404(Flight, pk=pk)
    current_datetime = timezone.now()

    # Создаем платеж
    payment = Payment.objects.create(
        user=request.user,  # Используем аутентифицированного пользователя из request.user
        flight=flight,
        price=flight.price,
        payment_date=current_datetime.date()
    )

    # Создаем билет на основе платежа
    ticket = Ticket.objects.create(
        user=request.user,
        payment=payment,
        flight=flight,
        price=flight.price
    )

    # Отправляем JSON-ответ о успешном создании платежа и билета
    return JsonResponse({
        'message': 'Payment successful',
        'ticket_id': ticket.id,  # Предоставляем ID созданного билета для ссылки или дальнейшего использования
        'payment_id': payment.id  # Предоставляем ID платежа
    }, status=status.HTTP_201_CREATED)

class UserPayments(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not logged in or not found'}, status=status.HTTP_403_FORBIDDEN)
        payments = Payment.objects.filter(user=request.user)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
  