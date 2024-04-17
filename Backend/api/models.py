
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user
class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    def __str__(self):
        return self.email
class Flight(models.Model):
    flight_id = models.AutoField(primary_key=True)
    departure_airport = models.CharField(max_length=100, db_index=True)
    arrival_airport = models.CharField(max_length=100, db_index=True)
    departure_time = models.DateTimeField(db_index=True)
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='payments')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
class Ticket(models.Model):
    ticket_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='tickets')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE)

