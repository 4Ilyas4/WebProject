
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Create token for the user after saving
    def has_perm(self, perm, obj=None):
        # Simplest possible answer: Yes, always
        return True
    
    def has_module_perms(self, app_label):
        # Implement your logic here to check if the user has permissions for the specified app_label
        return True 

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

# модель это общий формат данных который передается по проге и базыданных sqllite в файлах программы , 
#для него пишем сериализатор в дсон чтобы можно было передавать по cети через http
#JSON создав запрос/ответ в views с возможными разными http методами(GET,PUT,POST,...), и для каждого views  мы пише url путь к нему 
#чтобы обращаться к джанго серверу(наш апи) через урл и таким образом есть доступ к бд 
#далее на angular мы пишем сервис который берет и делает запрос на саервер по урл джанго сервера
#по путям в urls в зависимости от того какие нужны данные 
#там в запросе указываем метод и загаловки важно использовать наблюдатель в этом сервисе 
#после пишем пути сайта и компоненты для него(страницы) которые используют этоот апи сервис