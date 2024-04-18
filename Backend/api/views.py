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
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(TokenObtainPairView):
    pass

class UserTickets(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
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
@permission_classes([IsAuthenticated])
def user_detail(request):
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
@permission_classes([IsAuthenticated])
def make_payment(request, pk):
    flight = get_object_or_404(Flight, pk=pk)
    print(flight)
    current_datetime = timezone.now()

    payment = Payment.objects.create(
        user=request.user,
        flight=flight,
        price=flight.price,
        payment_date=current_datetime.date()
    )

    ticket = Ticket.objects.create(
        user=request.user,
        payment=payment,
        flight=flight,
        price=flight.price
    )

    return JsonResponse({
        'message': 'Payment successful',
        'ticket_id': ticket.ticket_id,
        'payment_id': payment.payment_id
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_payments(request):
    payments = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def flight_search(request):
    if request.method == 'GET': 
        min_price = request.query_params.get('max_price')
        flights = Flight.objects.filter(price__lte=min_price)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

