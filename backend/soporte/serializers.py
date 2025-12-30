from rest_framework import serializers
from .models import Ticket, Instalacion, SolicitudRecuperacion

class TicketSerializer(serializers.ModelSerializer):
    # Expose a friendlier name in the API: 'asunto' maps to model field 'titulo'.
    asunto = serializers.CharField(source='titulo', required=False, allow_blank=True)
    # Ensure the raw model field isn't required by the incoming payload (we use 'asunto')
    titulo = serializers.CharField(read_only=True)
    
    class Meta:
        model = Ticket
        fields = '__all__'

class InstalacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instalacion
        fields = '__all__'

class SolicitudRecuperacionSerializer(serializers.ModelSerializer):
    username_display = serializers.CharField(source='username', read_only=True)
    fecha_solicitud_display = serializers.DateTimeField(source='fecha_solicitud', read_only=True)
    
    class Meta:
        model = SolicitudRecuperacion
        fields = '__all__'
        read_only_fields = ['user', 'estado', 'fecha_solicitud', 'fecha_respuesta', 'atendida_por']


 