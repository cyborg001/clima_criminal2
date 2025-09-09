from django.db import models
from django.contrib.auth.models import User

class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cedula_identidad = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=255, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

class Victima(models.Model):
    nombre = models.CharField(max_length=255, blank=True, null=True)
    edad = models.IntegerField(blank=True, null=True)
    TIPO_VICTIMA_CHOICES = [
        ('agredida', 'Agredida'),
        ('asesinada', 'Asesinada'),
        ('otra', 'Otra'),
    ]
    tipo_victima = models.CharField(max_length=10, choices=TIPO_VICTIMA_CHOICES)

    def __str__(self):
        return self.nombre if self.nombre else "Victima anónima"

class Denuncia(models.Model):
    TIPO_CRIMEN_CHOICES = [
        ('robo', 'Robo'),
        ('violacion', 'Violación'),
        ('homicidio', 'Homicidio'),
        ('feminicidio', 'Feminicidio'),
    ]
    tipo_crimen = models.CharField(max_length=20, choices=TIPO_CRIMEN_CHOICES)
    descripcion = models.TextField()
    fecha = models.DateTimeField()
    latitud = models.FloatField()
    longitud = models.FloatField()
    victima = models.ForeignKey(Victima, on_delete=models.SET_NULL, null=True, blank=True)
    denunciante = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.get_tipo_crimen_display()} en {self.fecha}"

class ClimaCriminalidad(models.Model):
    area_geografica = models.CharField(max_length=255)
    latitud = models.FloatField()
    longitud = models.FloatField()
    nivel_criminalidad = models.FloatField()
    fecha_actualizacion = models.DateField()

    def __str__(self):
        return f"Clima Criminalidad en {self.area_geografica} (Nivel: {self.nivel_criminalidad})"

class Criminalidad(models.Model):
    fecha = models.DateField()
    tipo_delito = models.CharField(max_length=255)
    ubicacion = models.CharField(max_length=255)
    numero_incidentes = models.IntegerField()
    clima_criminalidad = models.ForeignKey(ClimaCriminalidad, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.tipo_delito} en {self.ubicacion} el {self.fecha} ({self.numero_incidentes} incidentes)"