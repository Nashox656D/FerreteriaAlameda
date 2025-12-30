from rest_framework import serializers
from .models import Empleado, Vacaciones
from django.contrib.auth.models import User, Group
import secrets
import string

class EmpleadoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    generated_password = serializers.CharField(read_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'

    def generate_password(self, length=12):
        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(secrets.choice(alphabet) for i in range(length))
        return password

    def create(self, validated_data):
        from rest_framework.exceptions import ValidationError
        
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        
        if not username:
            username = validated_data['rut'].replace('-', '').replace('.', '')
        
        if not password:
            password = self.generate_password()
        
        empleado = Empleado(**validated_data)
        
        try:
            user = User.objects.create_user(username=username, password=password)
            empleado_group, created = Group.objects.get_or_create(name='Empleado')
            user.groups.add(empleado_group)
            empleado.user = user
        except Exception as e:
            raise ValidationError({
                'user': f'Error al crear usuario: {str(e)}'
            })
        
        empleado.save()
        empleado._password = password
        
        return empleado
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, '_password'):
            representation['generated_password'] = instance._password
        return representation

class VacacionesSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.nombre', read_only=True)
    empleado_rut = serializers.CharField(source='empleado.rut', read_only=True)
    empleado_cargo = serializers.CharField(source='empleado.cargo', read_only=True)
    aprobada_por_nombre = serializers.CharField(source='aprobada_por.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Vacaciones
        fields = '__all__'
        extra_kwargs = {
            'empleado': {'required': False},
            'estado': {'read_only': True},
            'aprobada': {'read_only': True},
            'aprobada_por': {'read_only': True},
            'fecha_respuesta': {'read_only': True},
            'comentario_admin': {'read_only': True}
        }
