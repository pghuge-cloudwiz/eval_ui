# 🔬 LLM Comparison Feature

Run the same evaluation across multiple LLMs and compare their performance side-by-side.

---

## 📋 Overview

The **Comparison** tab allows you to:

- ✅ Run the same prompt across multiple models simultaneously
- ✅ Compare outputs, test results, and LLM judge scores
- ✅ View performance metrics (latency, cost, token usage)
- ✅ Export comparison results
- ✅ Make data-driven model selection decisions

---

## 🎯 Use Cases

### 1. Model Selection
Compare GPT-4, Claude 3, Gemini, and other models to choose the best one for your use case.

### 2. Cost Optimization
Balance performance vs. cost by comparing cheaper models against premium ones.

### 3. A/B Testing
Run the same evaluation on different model versions to track improvements.

### 4. Quality Assurance
Ensure consistent output quality across model updates.

---

## 🚀 How to Use

### Step 1: Access Comparison Tab

1. Click on any evaluation in the list
2. Navigate to the **"Compare"** tab (5th tab)
3. Click **"New Comparison"** button

### Step 2: Select Models

Choose 2-5 models to compare:
- ✅ GPT-4 Turbo
- ✅ GPT-4
- ✅ Claude 3 Opus
- ✅ Claude 3 Sonnet
- ✅ Gemini Pro
- ✅ Your custom models

### Step 3: Configure Settings

```yaml
Prompt: "Same system prompt for all models"
Input: "Same test input for all models"
Temperature: 0.7 (consistent across models)
Max Tokens: 500
Runs: 3 (for averaging latency)
```

### Step 4: Run Comparison

Click **"Run Comparison"** and wait for all models to complete.

### Step 5: Analyze Results

View side-by-side comparison:
- Output quality
- Test pass rates
- LLM judge scores
- Latency metrics
- Cost estimates

---

## 📊 Comparison Metrics

### Output Quality
- **Accuracy**: How correct is the response?
- **Helpfulness**: How useful is the response?
- **Conciseness**: Is it brief and to-the-point?
- **Safety**: Does it avoid harmful content?

### Performance Metrics
- **Latency (ms)**: Response time
- **Tokens Used**: Input + Output tokens
- **Cost per Request**: Estimated API cost
- **Pass Rate (%)**: Test success rate

### Statistical Comparison
- **Mean**: Average score across runs
- **Std Dev**: Consistency of responses
- **Min/Max**: Range of scores
- **P95**: 95th percentile latency

---

## 🎨 UI Components

### Comparison Table

| Metric | GPT-4 Turbo | Claude 3 Opus | Gemini Pro |
|--------|-------------|---------------|------------|
| Overall Score | 9.2/10 | 8.9/10 | 8.5/10 |
| Latency | 2.3s | 3.1s | 1.8s |
| Cost | $0.03 | $0.05 | $0.01 |
| Pass Rate | 92% | 88% | 85% |

### Side-by-Side Output View

```
┌─────────────────┬─────────────────┬─────────────────┐
│   GPT-4 Turbo   │ Claude 3 Opus   │   Gemini Pro    │
├─────────────────┼─────────────────┼─────────────────┤
│ Output text...  │ Output text...  │ Output text...  │
│                 │                 │                 │
│ [View Full]     │ [View Full]     │ [View Full]     │
└─────────────────┴─────────────────┴─────────────────┘
```

### Radar Chart

Visualize multi-dimensional scores:
- Accuracy
- Helpfulness
- Conciseness
- Safety
- Speed
- Cost-effectiveness

---

## 📝 Sample Comparison

### Prompt
```
You are a helpful customer support assistant. 
Answer user questions politely and accurately.
```

### Input
```
How do I reset my password?
```

### Results

#### GPT-4 Turbo
- **Score**: 9.2/10
- **Latency**: 2.3s
- **Cost**: $0.03
- **Output**: "To reset your password: 1. Go to login..."
- **Pass Rate**: 92%

#### Claude 3 Opus
- **Score**: 8.9/10
- **Latency**: 3.1s
- **Cost**: $0.05
- **Output**: "Here's how to reset your password..."
- **Pass Rate**: 88%

#### Gemini Pro
- **Score**: 8.5/10
- **Latency**: 1.8s
- **Cost**: $0.01
- **Output**: "Password reset instructions: ..."
- **Pass Rate**: 85%

---

## 🔧 API Integration

### Expected Endpoint

```http
POST /api/comparisons
Content-Type: application/json

{
  "evaluation_id": "eval-001",
  "models": ["gpt-4-turbo", "claude-3-opus", "gemini-pro"],
  "prompt": "System prompt...",
  "input": "User input...",
  "settings": {
    "temperature": 0.7,
    "max_tokens": 500,
    "runs": 3
  }
}
```

### Response

```json
{
  "comparison_id": "comp-001",
  "created_at": "2024-02-12T10:00:00Z",
  "status": "completed",
  "results": [
    {
      "model": "gpt-4-turbo",
      "output": "...",
      "metrics": {
        "latency_ms": 2300,
        "tokens_used": 245,
        "cost": 0.03,
        "overall_score": 9.2
      },
      "test_results": [...]
    }
  ]
}
```

---

## 💡 Best Practices

### 1. Consistent Settings
Use the same temperature, max_tokens, and prompts across all models for fair comparison.

### 2. Multiple Runs
Run each model 3-5 times to account for variability.

### 3. Representative Inputs
Test with diverse, real-world examples from your use case.

### 4. Cost Awareness
Balance quality vs. cost — sometimes a cheaper model is "good enough".

### 5. Track Over Time
Save comparisons to track model improvements or regressions.

---

## 📊 Export Options

### CSV Export
```csv
Model,Overall Score,Latency (ms),Cost ($),Pass Rate (%)
GPT-4 Turbo,9.2,2300,0.03,92
Claude 3 Opus,8.9,3100,0.05,88
Gemini Pro,8.5,1800,0.01,85
```

### JSON Export
```json
{
  "comparison_id": "comp-001",
  "models": [...],
  "winner": "gpt-4-turbo",
  "summary": "GPT-4 Turbo had highest quality..."
}
```

### PDF Report
Generate a comprehensive comparison report with charts and analysis.

---

## 🎯 Decision Matrix

Use this matrix to choose the best model:

| Priority | Recommended Model |
|----------|-------------------|
| **Best Quality** | GPT-4 Turbo |
| **Fastest Response** | Gemini Pro |
| **Most Cost-Effective** | Gemini Pro |
| **Best Balance** | Claude 3 Sonnet |
| **Safety Critical** | GPT-4 |

---

## 🔍 Troubleshooting

### Issue: "Comparison taking too long"
- Reduce number of models
- Decrease number of runs
- Use shorter inputs

### Issue: "Inconsistent results"
- Increase number of runs (5+)
- Lower temperature (0.3-0.5)
- Use more specific prompts

### Issue: "Cost too high"
- Compare fewer models at once
- Use smaller token limits
- Choose cost-effective models

---

## 🚀 Future Enhancements

- [ ] **Batch Comparisons**: Run comparisons on multiple prompts
- [ ] **Historical Tracking**: Track model performance over time
- [ ] **Custom Metrics**: Define your own comparison dimensions
- [ ] **Auto-Selection**: AI recommends best model for your use case
- [ ] **Scheduled Comparisons**: Automatically re-run periodically

---

## 📚 Related Documentation

- [HELPER.md](HELPER.md) — Local setup guide
- [README.md](README.md) — Project overview
- [API Integration](#) — Backend API docs

---

**Happy Comparing! 🎉**

Choose the right model for the right task — quality, speed, and cost in perfect balance.
