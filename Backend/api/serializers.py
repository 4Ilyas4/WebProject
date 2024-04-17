from datetime import timezone
from rest_framework import serializers
from .models import User, Flight, Ticket, Payment
from django.contrib.auth.hashers import make_password
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.password = make_password(validated_data['password'])
        instance.save()
        return instance
class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ['flight_id', 'departure_airport', 'arrival_airport', 'departure_time', 'arrival_time', 'price']
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
    def validate(self, data):
        if data['flight'].departure_time <= timezone.now():
            raise serializers.ValidationError("You cannot book a ticket for a flight that has already departed.")
        return data
class PaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Payment
        fields = '__all__'