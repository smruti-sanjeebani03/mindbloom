from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('category', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('is_anonymous', models.BooleanField(default=False)),
                ('is_reported', models.BooleanField(default=False)),
                ('report_reason', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stories', to='auth.user')),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
                'ordering': ['-created_at'],
            },
        ),
    ]
