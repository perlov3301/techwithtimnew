# Generated by Django 3.1.4 on 2021-01-25 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210125_0325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='guest_can_pause',
            field=models.BooleanField(default=False),
        ),
    ]
