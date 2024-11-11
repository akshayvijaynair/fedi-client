package com.example.contentfilterapi.model;

public class Content {
    private String textContent;

    // Default constructor
    public Content() {
    }

    // Parameterized constructor
    public Content(String textContent) {
        this.textContent = textContent;
    }

    // Getter for textContent
    public String getTextContent() {
        return textContent;
    }

    // Setter for textContent
    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }
}
