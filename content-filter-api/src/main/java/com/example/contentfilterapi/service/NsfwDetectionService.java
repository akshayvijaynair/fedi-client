package com.example.contentfilterapi.service;

import com.example.contentfilterapi.model.Content;
import com.example.contentfilterapi.ai.TextClassifier;
import org.springframework.stereotype.Service;

@Service
public class NsfwDetectionService {
    private final TextClassifier textClassifier;

    public NsfwDetectionService() {
        this.textClassifier = new TextClassifier();
    }

    public boolean isNsfw(Content content) {
        return textClassifier.isNsfw(content.getTextContent());
    }
}
