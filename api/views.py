from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Denuncia, Victima, ClimaCriminalidad, Criminalidad, PerfilUsuario
from .serializers import VictimaSerializer, DenunciaSerializer, ClimaCriminalidadSerializer, CriminalidadSerializer
from django.views.generic import TemplateView

class VictimaViewSet(viewsets.ModelViewSet):
    queryset = Victima.objects.all()
    serializer_class = VictimaSerializer

class DenunciaViewSet(viewsets.ModelViewSet):
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'fecha': ['gte', 'lte', 'date'],
        'tipo_crimen': ['exact'],
    }

    def perform_create(self, serializer):
        cedula = serializer.validated_data.pop('cedula_denunciante', None)
        user = None
        if cedula:
            try:
                perfil = PerfilUsuario.objects.get(cedula_identidad=cedula)
                user = perfil.user
            except PerfilUsuario.DoesNotExist:
                # Si la cédula no existe, el denunciante simplemente será nulo.
                pass
        serializer.save(denunciante=user)

class ClimaCriminalidadViewSet(viewsets.ModelViewSet):
    queryset = ClimaCriminalidad.objects.all()
    serializer_class = ClimaCriminalidadSerializer

class CriminalidadViewSet(viewsets.ModelViewSet):
    queryset = Criminalidad.objects.all()
    serializer_class = CriminalidadSerializer

class IndexView(TemplateView):
    template_name = 'index.html'