from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Command removed: email test helper was part of the reverted password-reset-by-email feature.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('send_test_email command disabled (email reset feature reverted).'))