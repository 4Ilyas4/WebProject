
from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='user-register'),
    path('login/', views.UserLogin.as_view(), name='user-login'),
    path('admin/', admin.site.urls),
    path('flights/', views.flight_list, name='flight-list'),
    path('flights/<int:pk>/', views.flight_detail, name='flight-detail'),
    path('tickets/', views.UserTickets.as_view(), name='ticket-list'),
    path('ticket/<int:pk>/', views.TicketDetails.as_view(), name='ticket-details'),
    path('payments/', views.UserPayments.as_view(), name='payment'),
    path('user/', views.user_detail, name='user-detail'), 
    path('payments/create/<int:pk>/', views.make_payment, name='create-payment'),
]

