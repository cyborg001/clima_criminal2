import random
from datetime import datetime, timedelta
import pytz
from django.core.management.base import BaseCommand
from api.models import Denuncia
from django.conf import settings

class Command(BaseCommand):
    help = 'Populate the database with 200 random crime reports'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing crime reports...')
        Denuncia.objects.all().delete()

        # Use the keys from the model choices
        crime_keys = [choice[0] for choice in Denuncia.TIPO_CRIMEN_CHOICES]
        
        descriptions = [
            "Asaltante utilizó un arma de fuego para intimidar.",
            "El vehículo fue sustraído mientras estaba estacionado.",
            "Asalto ocurrido en la calle a plena luz del día.",
            "Sustrajeron objetos de valor de la vivienda sin violencia.",
            "Propiedad pública fue dañada intencionalmente.",
            "Altercado físico entre dos o más personas.",
            "Estafa realizada a través de medios digitales."
        ]

        # Coordinates for Santo Domingo as the center
        center_lat = 18.4861
        center_lon = -69.9312

        # Get the timezone from settings
        try:
            timezone = pytz.timezone(settings.TIME_ZONE)
        except Exception:
            timezone = pytz.utc

        self.stdout.write('Generating 200 random crime reports...')
        for _ in range(200):
            # Generate random coordinates around the center
            lat = center_lat + random.uniform(-0.5, 0.5)
            lon = center_lon + random.uniform(-0.5, 0.5)

            # Generate a random date within the last year
            random_days = random.randint(0, 365)
            random_seconds = random.randint(0, 86399)
            random_date = timezone.localize(datetime.now() - timedelta(days=random_days, seconds=random_seconds))

            random_crime_type = random.choice(crime_keys)
            random_description = random.choice(descriptions)

            Denuncia.objects.create(
                tipo_crimen=random_crime_type,
                descripcion=f'{random_description} Reporte generado automáticamente.',
                latitud=lat,
                longitud=lon,
                fecha=random_date
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with 200 crime reports.'))
