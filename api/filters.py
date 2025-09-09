from django_filters import rest_framework as filters
from .models import Reporte

class ReporteFilter(filters.FilterSet):
    fecha_inicio = filters.DateFilter(field_name="fecha", lookup_expr='gte')
    fecha_fin = filters.DateFilter(field_name="fecha", lookup_expr='lte')

    class Meta:
        model = Reporte
        fields = ['fecha_inicio', 'fecha_fin']
