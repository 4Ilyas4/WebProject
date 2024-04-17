from django.contrib import admin

from api.models import Flight, Payment, Ticket, User

# Register your models here.
admin.site.register(User)
admin.site.register(Flight)
admin.site.register(Payment)
admin.site.register(Ticket)
