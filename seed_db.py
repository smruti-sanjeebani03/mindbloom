import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mindbloom_backend.settings')
django.setup()

from inspire.models import Quote, Affirmation, Article
from stories.models import Story

def seed_database():
    if Quote.objects.count() == 0:
        quotes_data = [
            {"content": "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", "author": "Christian D. Larson", "category": "Courage"},
            {"content": "Almost everything will work again if you unplug it for a few minutes, including you.", "author": "Anne Lamott", "category": "Rest"},
            {"content": "You do not have to be good. You only have to let the soft animal of your body love what it loves.", "author": "Mary Oliver", "category": "Self-Acceptance"},
            {"content": "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.", "author": "Albus Dumbledore", "category": "Hope"},
            {"content": "In the middle of winter, I found in myself at last an invincible summer.", "author": "Albert Camus", "category": "Resilience"}
        ]
        for q in quotes_data:
            Quote.objects.create(**q)
        print("Seeded Quotes!")

    if Affirmation.objects.count() == 0:
        affirmations_data = [
            {"content": "I am allowed to take up space and express my authentic feelings.", "category": "Self-Love"},
            {"content": "My peace is a priority, and I release the need to control what I cannot change.", "category": "Peace"},
            {"content": "Every step forward, no matter how small, is progress worth celebrating.", "category": "Growth"},
            {"content": "I am worthy of kindness, compassion, and gentle rest today.", "category": "Gentleness"}
        ]
        for a in affirmations_data:
            Affirmation.objects.create(**a)
        print("Seeded Affirmations!")

    if Article.objects.count() == 0:
        articles_data = [
            {
                "title": "The Art of Slowing Down in a Fast-Paced World",
                "summary": "Discover how intentional micro-pauses and mindful tea rituals can reset your nervous system.",
                "content": "In our relentless pursuit of productivity, we often treat rest as a reward rather than a necessity. Slowing down isn't about stopping; it's about aligning your speed with your capacity. Practice micro-pauses throughout your day: take 3 conscious breaths before opening emails or stepping into a meeting."
            },
            {
                "title": "Unpacking Academic & Career Anxiety",
                "summary": "Actionable cognitive techniques to reframe perfectionism and imposter syndrome.",
                "content": "When we tie our entire worth to output, every minor setback feels like a catastrophe. Reframing starts with recognizing that thoughts are proposals, not facts. When you notice imposter thoughts, write them down and evaluate the objective evidence."
            },
            {
                "title": "Building a Gentle Night Ritual for Restful Sleep",
                "summary": "Transform your bedroom into a cozy sanctuary free from blue light and mental clutter.",
                "content": "Sleep hygiene begins hours before your head hits the pillow. Warm lighting, calming scents like lavender, and brain-dump journaling clear cognitive space for deep sleep."
            }
        ]
        for art in articles_data:
            Article.objects.create(**art)
        print("Seeded Articles!")

    if Story.objects.count() == 0:
        stories_data = [
            {
                "title": "Learning to Embrace the Quiet Moments",
                "content": "For years I thought my value was tied to how busy my calendar was. Turning off notifications for an hour every evening felt terrifying at first, but it gave me back my mind.",
                "category": "Mindfulness",
                "is_anonymous": False
            },
            {
                "title": "Overcoming Exam Panic with 4-7-8 Breathing",
                "content": "During my midterms, BloomBot walked me through box breathing right in the hallway. I managed to calm my racing heartbeat and walked into the exam room feeling grounded.",
                "category": "Anxiety",
                "is_anonymous": True
            },
            {
                "title": "My Daily Journaling Breakthrough",
                "content": "Writing down three small things I'm grateful for every night shifted my perspective from feeling overwhelmed to noticing the cozy beauty in everyday moments.",
                "category": "Growth",
                "is_anonymous": False
            }
        ]
        for s in stories_data:
            Story.objects.create(**s)
        print("Seeded Stories!")

if __name__ == "__main__":
    seed_database()
