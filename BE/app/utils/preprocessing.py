import string
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
import re

factory_stop = StopWordRemoverFactory()
stopwords_sastrawi = set(factory_stop.get_stop_words())

factory_stem = StemmerFactory()
stemmer = factory_stem.create_stemmer()

def clean_text(text):
    text = text.lower() 
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    tokens = text.strip().split()

    filtered_tokens = [word for word in tokens if word not in stopwords_sastrawi]

    stemmed_tokens = [stemmer.stem(word) for word in filtered_tokens]

    return " ".join(stemmed_tokens)