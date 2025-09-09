from rest_framework import serializers
from .models import Denuncia, Victima, ClimaCriminalidad, Criminalidad, PerfilUsuario

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'

class VictimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Victima
        fields = '__all__'

class DenunciaSerializer(serializers.ModelSerializer):
    cedula_denunciante = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Denuncia
        fields = '__all__'
        read_only_fields = ('denunciante',)

class ClimaCriminalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimaCriminalidad
        fields = '__all__'

class CriminalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criminalidad
        fields = '__all__'
