from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from rrhh.models import Empleado, Vacaciones
from ventas.models import Cotizacion

class Command(BaseCommand):
    help = 'Configura roles y permisos para el sistema'

    def handle(self, *args, **options):
        empleado_group, created = Group.objects.get_or_create(name='Empleado')
        
        vacaciones_ct = ContentType.objects.get_for_model(Vacaciones)
        cotizacion_ct = ContentType.objects.get_for_model(Cotizacion)
        
        view_vacaciones = Permission.objects.get(codename='view_vacaciones', content_type=vacaciones_ct)
        add_vacaciones = Permission.objects.get(codename='add_vacaciones', content_type=vacaciones_ct)
        view_cotizacion = Permission.objects.get(codename='view_cotizacion', content_type=cotizacion_ct)
        
        empleado_group.permissions.set([view_vacaciones, add_vacaciones, view_cotizacion])
        
        if created:
            self.stdout.write(self.style.SUCCESS('Grupo "Empleado" creado exitosamente'))
        else:
            self.stdout.write(self.style.SUCCESS('Grupo "Empleado" actualizado exitosamente'))
        
        self.stdout.write(self.style.SUCCESS(f'Permisos asignados: {empleado_group.permissions.count()}'))
