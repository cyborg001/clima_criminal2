from django.contrib import admin
from .models import ClimaCriminalidad, Criminalidad, Victima, Denuncia

admin.site.register(ClimaCriminalidad)
admin.site.register(Criminalidad)
admin.site.register(Victima)
admin.site.register(Denuncia)