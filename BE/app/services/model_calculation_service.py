"""
Service untuk menghitung dan menyediakan data step-by-step 
perhitungan model Naive Bayes untuk keperluan edukasi/demonstrasi.
"""

import numpy as np
import pandas as pd
from flask import jsonify
from sklearn.metrics import confusion_matrix, accuracy_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from collections import Counter
import re
import string

from ..utils.model import model, vectorizer, df, DATA_PATH
from ..utils.preprocessing import clean_text, stopwords_sastrawi, stemmer


def get_dataset_info():
    """
    Mengembalikan informasi dataset:
    - Total data
    - Distribusi per kategori
    - Sample data per kategori
    """
    # Distribusi kategori
    category_counts = df['Kategori'].value_counts().to_dict()
    categories = [
        {"kategori": k, "jumlah": v} 
        for k, v in category_counts.items()
    ]
    
    # Sample data per kategori (2 data per kategori)
    sample_data = []
    for kategori in df['Kategori'].unique():
        subset = df[df['Kategori'] == kategori].head(2)
        for _, row in subset.iterrows():
            sample_data.append({
                "kategori": kategori,
                "pertanyaan": row['Pertanyaan'],
                "jawaban": row['Jawaban']
            })
    
    return {
        "total": len(df),
        "categories": categories,
        "sample_data": sample_data
    }


def demo_preprocessing(text):
    """
    Menampilkan hasil setiap tahap preprocessing secara terpisah.
    """
    steps = []
    
    # Original
    original = text
    
    # Step 1: Case Folding
    step1_result = text.lower()
    steps.append({
        "step": "Case Folding",
        "description": "Mengubah semua huruf menjadi huruf kecil",
        "input": original,
        "output": step1_result
    })
    
    # Step 2: Remove Numbers
    step2_result = re.sub(r"\d+", "", step1_result)
    steps.append({
        "step": "Remove Numbers",
        "description": "Menghapus semua angka",
        "input": step1_result,
        "output": step2_result
    })
    
    # Step 3: Remove Punctuation
    step3_result = step2_result.translate(str.maketrans("", "", string.punctuation))
    steps.append({
        "step": "Remove Punctuation",
        "description": "Menghapus tanda baca",
        "input": step2_result,
        "output": step3_result
    })
    
    # Step 4: Tokenizing
    tokens = step3_result.strip().split()
    steps.append({
        "step": "Tokenizing",
        "description": "Memecah kalimat menjadi token (kata-kata)",
        "input": step3_result,
        "output": tokens
    })
    
    # Step 5: Stopword Removal
    filtered_tokens = [word for word in tokens if word not in stopwords_sastrawi]
    steps.append({
        "step": "Stopword Removal",
        "description": "Menghapus kata-kata umum yang tidak bermakna",
        "input": tokens,
        "output": filtered_tokens,
        "removed": [word for word in tokens if word in stopwords_sastrawi]
    })
    
    # Step 6: Stemming
    stemmed_tokens = [stemmer.stem(word) for word in filtered_tokens]
    steps.append({
        "step": "Stemming",
        "description": "Mengubah kata ke bentuk dasar",
        "input": filtered_tokens,
        "output": stemmed_tokens
    })
    
    final_result = " ".join(stemmed_tokens)
    
    return {
        "original": original,
        "steps": steps,
        "final": final_result,
        "final_tokens": stemmed_tokens
    }


def get_training_info():
    """
    Mengembalikan informasi parameter training model.
    """
    # Get vocabulary size
    vocab_size = len(vectorizer.vocabulary_)
    
    # Simulate train/test split info (80/20)
    total_data = len(df)
    train_size = int(total_data * 0.8)
    test_size = total_data - train_size
    
    # Get feature names
    feature_names = vectorizer.get_feature_names_out().tolist()[:50]  # First 50 only
    
    return {
        "model": "MultinomialNB (Multinomial Naive Bayes)",
        "vectorizer": "CountVectorizer (Bag of Words)",
        "train_size": train_size,
        "test_size": test_size,
        "train_percentage": 80,
        "test_percentage": 20,
        "vocabulary_size": vocab_size,
        "sample_vocabulary": feature_names,
        "random_state": 42
    }


def get_confusion_matrix_data():
    """
    Menghitung confusion matrix dari model yang sudah terlatih.
    """
    # Re-split data untuk evaluasi
    X = df['clean_pertanyaan']
    y = df['Kategori']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Vectorize dan prediksi
    X_test_vec = vectorizer.transform(X_test)
    y_pred = model.predict(X_test_vec)
    
    # Hitung confusion matrix
    labels = sorted(df['Kategori'].unique())
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Convert to list for JSON
    cm_list = cm.tolist()
    
    return {
        "confusion_matrix": cm_list,
        "labels": labels,
        "accuracy": round(accuracy, 4),
        "accuracy_percentage": round(accuracy * 100, 2)
    }


def calculate_prior_probability():
    """
    Menghitung Prior Probability untuk setiap kategori.
    P(C) = Jumlah data kategori C / Total data
    """
    total = len(df)
    category_counts = df['Kategori'].value_counts().to_dict()
    
    prior_probs = []
    for kategori, count in category_counts.items():
        prob = count / total
        prior_probs.append({
            "kategori": kategori,
            "jumlah_data": count,
            "total_data": total,
            "formula": f"{count} / {total}",
            "probability": round(prob, 4)
        })
    
    return {
        "formula": "P(C) = Jumlah data kategori C / Total data",
        "total_data": total,
        "results": prior_probs
    }


def calculate_word_frequency(tokens):
    """
    Menghitung frekuensi kata dari pertanyaan uji pada setiap kategori.
    """
    word_freq = []
    
    for token in tokens:
        freq_per_category = {"kata": token}
        for kategori in df['Kategori'].unique():
            subset = df[df['Kategori'] == kategori]
            # Hitung frekuensi kata di kategori tersebut
            all_words = " ".join(subset['clean_pertanyaan'].fillna('')).split()
            count = all_words.count(token)
            freq_per_category[kategori] = count
        word_freq.append(freq_per_category)
    
    return word_freq


def calculate_total_words_per_category():
    """
    Menghitung total kata per kategori.
    """
    total_words = {}
    for kategori in df['Kategori'].unique():
        subset = df[df['Kategori'] == kategori]
        all_words = " ".join(subset['clean_pertanyaan'].fillna('')).split()
        total_words[kategori] = len(all_words)
    
    return total_words


def calculate_likelihood(tokens):
    """
    Menghitung Likelihood dengan Laplace Smoothing.
    P(w|C) = (count(w) + 1) / (Total kata kategori + |V|)
    """
    vocab_size = len(vectorizer.vocabulary_)
    total_words = calculate_total_words_per_category()
    word_freq = calculate_word_frequency(tokens)
    
    likelihood_results = []
    
    for kategori in df['Kategori'].unique():
        total_kata = total_words[kategori]
        denominator = total_kata + vocab_size
        
        kata_likelihoods = []
        for wf in word_freq:
            kata = wf["kata"]
            count = wf[kategori]
            likelihood = (count + 1) / denominator
            
            kata_likelihoods.append({
                "kata": kata,
                "count": count,
                "count_plus_1": count + 1,
                "formula": f"({count} + 1) / ({total_kata} + {vocab_size})",
                "likelihood": round(likelihood, 6)
            })
        
        likelihood_results.append({
            "kategori": kategori,
            "total_kata_kategori": total_kata,
            "vocabulary_size": vocab_size,
            "denominator": denominator,
            "kata_likelihoods": kata_likelihoods
        })
    
    return {
        "formula": "P(w|C) = (count(w) + 1) / (Total kata kategori + |V|)",
        "vocabulary_size": vocab_size,
        "results": likelihood_results
    }


def calculate_posterior(tokens):
    """
    Menghitung Posterior Probability.
    P(C|X) = P(C) × Π P(w|C)
    """
    # Get prior probabilities
    prior_data = calculate_prior_probability()
    prior_probs = {r["kategori"]: r["probability"] for r in prior_data["results"]}
    
    # Get likelihood
    likelihood_data = calculate_likelihood(tokens)
    
    posterior_results = []
    
    for lik_result in likelihood_data["results"]:
        kategori = lik_result["kategori"]
        prior = prior_probs[kategori]
        
        # Multiply all likelihoods
        likelihood_product = 1.0
        likelihood_values = []
        for kl in lik_result["kata_likelihoods"]:
            likelihood_product *= kl["likelihood"]
            likelihood_values.append(kl["likelihood"])
        
        posterior = prior * likelihood_product
        
        posterior_results.append({
            "kategori": kategori,
            "prior": prior,
            "likelihood_values": likelihood_values,
            "likelihood_product": likelihood_product,
            "formula": f"{prior} × {' × '.join([str(round(l, 6)) for l in likelihood_values])}",
            "posterior": posterior,
            "posterior_formatted": f"{posterior:.2e}"
        })
    
    # Sort by posterior (descending)
    posterior_results.sort(key=lambda x: x["posterior"], reverse=True)
    
    # Mark the winner
    if posterior_results:
        posterior_results[0]["is_max"] = True
    
    predicted_category = posterior_results[0]["kategori"] if posterior_results else None
    
    return {
        "formula": "P(C|X) = P(C) × Π P(w|C)",
        "results": posterior_results,
        "predicted_category": predicted_category
    }


def calculate_cosine_similarity_steps(test_tokens, predicted_category):
    """
    Menghitung Cosine Similarity antara pertanyaan uji dengan jawaban pada kategori terpilih.
    """
    # Filter dataset by predicted category
    subset = df[df['Kategori'] == predicted_category].copy()
    
    if subset.empty:
        return {
            "error": "Tidak ada data pada kategori terpilih",
            "predicted_category": predicted_category
        }
    
    # Get clean text for test input
    test_clean = " ".join(test_tokens)
    
    # Vectorize test input
    test_vec = vectorizer.transform([test_clean])
    test_vec_array = test_vec.toarray()[0]
    
    # Vectorize all answers in subset
    subset_clean = subset['clean_pertanyaan'].tolist()
    subset_vec = vectorizer.transform(subset_clean)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(test_vec, subset_vec)[0]
    
    # Get top 5 results
    top_indices = np.argsort(similarities)[-5:][::-1]
    
    similarity_results = []
    for idx in top_indices:
        row = subset.iloc[idx]
        similarity_results.append({
            "index": int(idx),
            "pertanyaan": row['Pertanyaan'],
            "jawaban": row['Jawaban'],
            "similarity": round(float(similarities[idx]), 4),
            "similarity_percentage": round(float(similarities[idx]) * 100, 2)
        })
    
    # Best match
    best_idx = int(similarities.argmax())
    best_row = subset.iloc[best_idx]
    max_similarity = float(similarities.max())
    
    # Get vocabulary for visualization (simplified)
    feature_names = vectorizer.get_feature_names_out()
    non_zero_indices = np.nonzero(test_vec_array)[0]
    test_vocabulary = [feature_names[i] for i in non_zero_indices]
    test_values = [int(test_vec_array[i]) for i in non_zero_indices]
    
    return {
        "formula": "CosSim(A,B) = (A · B) / (||A|| × ||B||)",
        "test_clean": test_clean,
        "test_vocabulary": test_vocabulary,
        "test_values": test_values,
        "similarity_results": similarity_results,
        "best_match": {
            "pertanyaan": best_row['Pertanyaan'],
            "jawaban": best_row['Jawaban'],
            "similarity": round(max_similarity, 4),
            "similarity_percentage": round(max_similarity * 100, 2)
        }
    }


def get_full_calculation(test_sentence=None):
    """
    Mengembalikan perhitungan lengkap step-by-step.
    """
    # Default test sentence
    if not test_sentence:
        test_sentence = "Nilai KHS Saya Belum Masuk"
    
    # 1. Dataset Info
    dataset_info = get_dataset_info()
    
    # 2. Preprocessing
    preprocessing_result = demo_preprocessing(test_sentence)
    test_tokens = preprocessing_result["final_tokens"]
    
    # 3. Training Info
    training_info = get_training_info()
    
    # 4. Confusion Matrix
    evaluation = get_confusion_matrix_data()
    
    # 5. Prior Probability
    prior_probability = calculate_prior_probability()
    
    # 6. Word Frequency
    word_frequency = calculate_word_frequency(test_tokens)
    
    # 7. Likelihood
    likelihood = calculate_likelihood(test_tokens)
    
    # 8. Posterior Probability
    posterior = calculate_posterior(test_tokens)
    predicted_category = posterior["predicted_category"]
    
    # 9. Cosine Similarity
    cosine_sim = calculate_cosine_similarity_steps(test_tokens, predicted_category)
    
    # 10. Final Result
    final_result = {
        "test_sentence": test_sentence,
        "predicted_category": predicted_category,
        "answer": cosine_sim.get("best_match", {}).get("jawaban", "Tidak ditemukan jawaban")
    }
    
    return {
        "dataset": dataset_info,
        "preprocessing": preprocessing_result,
        "training": training_info,
        "evaluation": evaluation,
        "prior_probability": prior_probability,
        "word_frequency": word_frequency,
        "likelihood": likelihood,
        "posterior": posterior,
        "cosine_similarity": cosine_sim,
        "result": final_result
    }
