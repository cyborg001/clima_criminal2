from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import VictimaViewSet, DenunciaViewSet, ClimaCriminalidadViewSet, CriminalidadViewSet

router = DefaultRouter()
router.register(r'victimas', VictimaViewSet)
router.register(r'denuncias', DenunciaViewSet)
router.register(r'climacriminalidad', ClimaCriminalidadViewSet)
router.register(r'criminalidad', CriminalidadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]