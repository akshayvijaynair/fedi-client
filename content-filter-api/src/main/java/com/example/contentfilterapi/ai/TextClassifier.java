package com.example.contentfilterapi.ai;

import smile.classification.BernoulliNB;
import smile.data.SparseDataset;
import smile.data.formula.Formula;
import smile.nlp.Dictionary;
import smile.nlp.normalizer.SimpleNormalizer;
import smile.nlp.tokenizer.SimpleTokenizer;
import smile.nlp.vector.TfIdfVectorizer;

import java.util.Arrays;

public class TextClassifier {
    private BernoulliNB model;
    private TfIdfVectorizer<String> vectorizer;
    private Dictionary dictionary;

    public TextClassifier() {
        dictionary = new Dictionary();
        vectorizer = new TfIdfVectorizer<>(dictionary);
        trainModel();
    }

    private void trainModel() {
        String[] texts = {
                "inappropriate explicit content",  // NSFW
                "safe text without issues",        // SAFE
                "offensive language and content",  // NSFW
                "informative and useful content",  // SAFE
                "harassment or abusive language",  // NSFW
                "friendly and polite language"     // SAFE
        };

        int[] labels = {1, 0, 1, 0, 1, 0}; // 1 = NSFW, 0 = SAFE

        // Preprocess text and create features
        String[][] tokens = Arrays.stream(texts)
                .map(text -> new SimpleTokenizer().split(new SimpleNormalizer().normalize(text)))  // Create new instances
                .toArray(String[][]::new);

        SparseDataset dataset = vectorizer.fitTransform(tokens);
        model = BernoulliNB.fit(Formula.lhs("label"), dataset, labels);
    }

    public boolean isNsfw(String text) {
        String[] tokens = new SimpleTokenizer().split(new SimpleNormalizer().normalize(text));  // Create new instances
        double[] features = vectorizer.transform(tokens);
        int label = model.predict(features);
        return label == 1; // 1 indicates NSFW
    }
}
