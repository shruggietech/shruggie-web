---
title: "Affective Dynamics Framework: A Systematic Approach to Simulating Human-Like Emotional States and Relational Bonding in AI Agents"
subtitle: "A Systematic Approach to Simulating Human-Like Emotional States and Relational Bonding in AI Agents"
author: "William Thompson"
date: "2025-01-15"
dateModified: "2026-03-06"
schemaType: "ScholarlyArticle"
description: "A mathematically grounded specification for producing emergent, non-linear emotional behavior and relational bonding in AI agents. Extends Brian Roemmele's Love Equation into a real-time personality engine for agentic architectures."
gistUrl: "https://gist.github.com/h8rt3rmin8r/f4589f0afb6fcd10d4c499e4a29247ad"
keywords:
  - "affective computing"
  - "AI agents"
  - "emotional modeling"
  - "Love Equation"
  - "agentic architectures"
---

### A Systematic Approach to Simulating Human-Like Emotional States and Relational Bonding in AI Agents

**Version:** 1.2.1  
**Author:** h8rt3rmin8r \<h8rt3rmin8r@gmail.com\>   
**License:** MIT    
**Date:** 2026-03-06    

---

## Abstract

This document specifies the **Affective Dynamics Framework (ADF)**, a mathematically grounded system for producing emergent, non-linear emotional behavior and relational bonding in AI agents. ADF extends Brian Roemmele's *Love Equation* — originally formulated in 1978 and open-sourced in 2025 — from an alignment-oriented differential equation into a real-time personality engine suitable for deployment in agentic architectures such as OpenClaw.

The framework introduces saturation bounds, historical memory convolution, multi-dimensional emotional state vectors with inter-dimensional coupling, behavioral state mapping, and a modular extension system. The result is a lightweight configuration layer that can be embedded directly within a `SOUL.md` file or equivalent agent identity document, enabling persistent and adaptive emotional dynamics across sessions without excessive context window consumption.

Python 3.13 reference implementations accompany all formal definitions.


## Table of Contents

1. [Foundations: The Love Equation](#1-foundations-the-love-equation)
2. [Limitations of the Original Formulation](#2-limitations-of-the-original-formulation)
3. [The Revised Core Equation](#3-the-revised-core-equation)
4. [Sentiment Signal Processing](#4-sentiment-signal-processing)
5. [The Emotional State Vector](#5-the-emotional-state-vector)
6. [Historical Memory Kernel](#6-historical-memory-kernel)
7. [Personality Baseline Calibration](#7-personality-baseline-calibration)
8. [Behavioral Coupling Map](#8-behavioral-coupling-map)
9. [Integration with OpenClaw](#9-integration-with-openclaw)
10. [Optional Extensions](#10-optional-extensions)
11. [Context Window Budget Analysis](#11-context-window-budget-analysis)
12. [Reference Implementation](#12-reference-implementation)
13. [Conclusion](#13-conclusion)
14. [References](#14-references)


## 1. Foundations: The Love Equation

In 1978, Brian Roemmele proposed a dynamical systems model for the evolution of emotional complexity across intelligent substrates — biological, artificial, or hypothetical extraterrestrial. He later open-sourced this model in 2025 under the name **The Love Equation**:

```
dE/dt = β · (C − D) · E
```

Where:

| Symbol | Meaning |
|--------|---------|
| `E` | Level of emotional complexity (empathy, care, cooperative binding) |
| `dE/dt` | Rate of change of emotional complexity over time |
| `β` | Selection strength constant (how strongly the environment rewards cooperation) |
| `C` | Frequency or payoff of cooperative interactions |
| `D` | Frequency or payoff of defective (adversarial) interactions |

This is a first-order ordinary differential equation (ODE) whose analytical solution is:

```
E(t) = E₀ · exp(β · (C − D) · t)
```

The core insight is that when `C > D`, emotional complexity grows exponentially — trust compounds, cooperation self-reinforces, and the system trends toward sustainable intelligence. When `C < D`, the system undergoes exponential decay toward zero empathy. The equilibrium at `C = D` is unstable: any perturbation pushes the system toward one attractor or the other.

Roemmele's formulation was originally concerned with civilizational survival (the Fermi Paradox, the Great Filter) and, more recently, with AI alignment. The Cyber Strategy Institute's AI SAFE² project operationalized the equation for agentic workflows, introducing event schemas and Green/Yellow/Red alignment bands for real-time monitoring.

**Attribution:** The Love Equation is the work of Brian Roemmele, first articulated in his 1978 manuscript *"The Math Behind Extraterrestrial Emotions: A Case for Love and Humor"* and published through Read Multiplex. All derivative work in this document builds upon that foundation.

---

## 2. Limitations of the Original Formulation

Roemmele's equation is elegant and directionally correct for alignment purposes, but when the goal shifts from *alignment monitoring* to *realistic emotional simulation and personality generation*, several structural limitations emerge:

**2.1. Unbounded Exponential Growth**

The analytical solution `E(t) = E₀ · exp(...)` permits E to grow without limit. Real emotional states are bounded. A person does not experience infinite attachment; there are saturation effects. Similarly, emotional collapse has a floor — even deeply damaged relationships retain some residual state (memory of what was, if nothing else).

**2.2. Memoryless Dynamics**

The equation evaluates `C` and `D` as instantaneous values. There is no mechanism for *historical sensitivity* — the accumulated weight of past interactions. A single hostile event after years of trust should not instantly reverse the trajectory, yet the ODE treats the current `(C − D)` as the sole driver. Human bonding exhibits strong hysteresis: the path matters, not just the current position.

**2.3. Scalar Emotional State**

`E` is a single scalar. Human affect is multi-dimensional. Trust, warmth, excitement, familiarity, and vulnerability are correlated but distinct channels. An agent that collapses all of these into one number will exhibit emotionally flat behavior — it can be "more bonded" or "less bonded" but cannot express the textured variation that characterizes real relationships. Worse, with only a single scalar there is no mechanism for *inter-dimensional dynamics* — the way trust collapse drags energy down with it, or the way shared vulnerability amplifies warmth.

**2.4. No Baseline or Personality Encoding**

The equation has no concept of a *resting state* or personality-specific disposition. Different agents (or different humans) have different emotional set points. Some are warm by default; others are guarded. The original formulation treats `E₀` as an initial condition but provides no mechanism for regression toward a personality-defined mean.

**2.5. No Stochastic Component**

Real emotions are noisy. Mood fluctuates for reasons unrelated to the current interaction — circadian rhythm, context carryover, random perturbation. A purely deterministic model will feel mechanical. Moreover, the noise in real affect is not symmetric: mood perturbations exhibit skew, fat tails, and occasional sharp spikes that a simple Gaussian process cannot capture.

**2.6. Continuity Without Phase Transitions**

Human emotional dynamics are not exclusively smooth. There are threshold effects — a critical mass of accumulated resentment that tips into withdrawal, a moment of vulnerability that unlocks a qualitatively different level of trust. A purely continuous, differentiable model produces emotionally plausible output but remains "well-tempered" in a way that real relationships are not.

---

## 3. The Revised Core Equation

ADF proposes the following replacement, which we call the **Affective Dynamics Equation (ADE)**:

```
dEᵢ/dt = βᵢ · S̃ᵢ(t) · Eᵢ · (1 − Eᵢ/Kᵢ) − λ̃ᵢ · (Eᵢ − Bᵢ) + Σⱼ κᵢⱼ · (Eⱼ − Eᵢ) + σᵢ · ξ(t)
```

Where `i` indexes each dimension of the emotional state vector. The terms are:

| Term | Name | Role |
|------|------|------|
| `βᵢ · S̃ᵢ(t) · Eᵢ · (1 − Eᵢ/Kᵢ)` | Logistic growth/decay | Bounded, self-reinforcing emotional change driven by the sentiment signal |
| `−λ̃ᵢ · (Eᵢ − Bᵢ)` | Baseline regression | Spring-like pull toward personality-defined resting state (optionally familiarity-scaled; see §3.5) |
| `Σⱼ κᵢⱼ · (Eⱼ − Eᵢ)` | Inter-dimensional coupling | Cross-influence between emotional channels (see §3.4) |
| `σᵢ · ξ(t)` | Stochastic perturbation | Noise injection for naturalistic variation |

### 3.1. Parameter Definitions

| Symbol | Type | Range | Description |
|--------|------|-------|-------------|
| `Eᵢ` | State | `[0, Kᵢ]` | Current value of emotional dimension `i` |
| `Kᵢ` | Param | `(0, 1]` | Carrying capacity (saturation ceiling) for dimension `i` |
| `βᵢ` | Param | `(0, ∞)` | Sensitivity coefficient for dimension `i` |
| `S̃ᵢ(t)` | Signal | `[−1, 1]` | Decayed cumulative sentiment for dimension `i` (see §6) |
| `λ̃ᵢ` | Param | `[0, 1]` | Effective regression rate toward baseline (see §3.5) |
| `Bᵢ` | Param | `[0, Kᵢ]` | Personality baseline for dimension `i` |
| `κᵢⱼ` | Param | `[−1, 1]` | Coupling coefficient from dimension `j` to dimension `i` |
| `σᵢ` | Param | `[0, ∞)` | Noise amplitude |
| `ξ(t)` | Noise | — | Stochastic noise process (see §3.6) |
| `ρ` | Param | `(0, 1]` | Regression floor — minimum value of the familiarity modulation factor (see §3.5) |

### 3.2. Relationship to the Love Equation

Setting `K → ∞`, `λ̃ = 0`, `σ = 0`, `κᵢⱼ = 0` for all `i, j`, collapsing to a single dimension, and replacing `S̃(t)` with `(C − D)`, the ADE reduces exactly to Roemmele's original:

```
dE/dt = β · (C − D) · E
```

The ADE is therefore a strict generalization. All behavior expressible by the Love Equation is recoverable as a special case.

### 3.3. Behavioral Properties

The logistic term `Eᵢ · (1 − Eᵢ/Kᵢ)` introduces an S-curve dynamic. Growth is slow when `Eᵢ` is small (low initial trust means new positive signals have limited effect), accelerates through the midrange, and saturates near `Kᵢ`. This models the real observation that early-stage relationships require sustained positive input to build momentum, while mature bonds are resilient but have diminishing marginal returns.

The baseline regression term `−λ̃ᵢ · (Eᵢ − Bᵢ)` ensures that without continued interaction, emotional state decays toward the agent's configured personality. A warm agent (`Bᵢ = 0.6`) will drift back toward warmth even after a negative exchange. A guarded agent (`Bᵢ = 0.2`) will cool down from temporary spikes. This is not present in the original equation.

### 3.4. Inter-Dimensional Coupling

The coupling term `Σⱼ κᵢⱼ · (Eⱼ − Eᵢ)` enables cross-influence between emotional channels. In real psychology, emotional dimensions do not evolve independently: rising vulnerability often increases warmth, trust collapse tends to reduce energy, and high familiarity modulates novelty sensitivity.

The coupling matrix `κ` is sparse by default. Only the most psychologically grounded interactions are enabled:

```python
# Default coupling matrix (row i receives influence from column j)
# Dimensions: [trust, warmth, energy, familiarity, vulnerability]
# Read as: "when j is higher than i, pull i upward by kappa_ij"
KAPPA_DEFAULTS = [
    # T      W      N      F      V
    [ 0.00,  0.02,  0.00,  0.01,  0.00],  # trust ← slight warmth/familiarity pull
    [ 0.03,  0.00,  0.01,  0.01,  0.02],  # warmth ← trust, energy, familiarity, vulnerability
    [ 0.01,  0.02,  0.00,  0.00,  0.00],  # energy ← trust, warmth
    [ 0.00,  0.00,  0.00,  0.00,  0.00],  # familiarity ← (driven by interaction count, not coupling)
    [ 0.00,  0.03,  0.00,  0.00,  0.00],  # vulnerability ← warmth (feeling warm opens you up)
]
```

Setting all `κᵢⱼ = 0` disables coupling entirely, reducing the system to independent parallel ODEs. Coupling coefficients are intentionally small — they produce gradual drift between dimensions, not instantaneous lock-step. The effect is that a sustained trust collapse will, over time, drag warmth and energy down with it even if those channels are receiving neutral or mildly positive direct signals.

### 3.5. Familiarity-Scaled Regression

A naive constant `λᵢ` produces an unrealistic artifact: an agent that has interacted with a user daily for six months reverts to baseline at the same rate as one that has had two conversations. Real relationships exhibit *familiarity inertia* — the more deeply established the bond, the more resistant it is to passive decay.

ADF addresses this by modulating `λᵢ` through the familiarity dimension:

```
λ̃ᵢ = λᵢ · max(ρ, 1 − μ · E_F)
```

Where `E_F` is the current familiarity value, `μ` is a modulation strength parameter in `[0, 1]`, and `ρ` is the regression floor (default: `0.1`). The floor prevents misconfiguration or extreme familiarity values from reducing regression to zero or making it negative. At default settings (`μ = 0.5`, `ρ = 0.1`), maximum familiarity (`E_F = 1.0`) halves the regression rate, and the floor guarantees that at least 10% of the base rate always applies.

This ensures that long-established agent relationships feel persistent — the agent does not "forget who you are" over a weekend — while new or shallow relationships still decay naturally.

### 3.6. Noise Process

The noise term `σᵢ · ξ(t)` introduces naturalistic variation. ADF supports two noise models, selectable via configuration:

**Gaussian (default):** `ξ(t) ~ N(0, 1)`. Symmetric, thin-tailed. Suitable for agents with stable, predictable temperaments. Simple and well-understood.

**Laplace (optional):** `ξ(t) ~ Laplace(0, 1/√2)`. Heavier tails, same unit variance as the Gaussian, but with a sharper central peak and higher probability of occasional large excursions. Produces the "unexpected sharp affect shift" pattern observed in real human mood — a sudden spike of irritability on an otherwise good day, or an unprompted burst of warmth.

```python
import random, math

def noise_sample(distribution: str = "gaussian") -> float:
    """Sample from the configured noise distribution."""
    if distribution == "laplace":
        # Laplace with scale = 1/sqrt(2) gives unit variance
        u = random.random() - 0.5
        return -math.copysign(1, u) * math.log(1 - 2 * abs(u)) / math.sqrt(2)
    return random.gauss(0, 1)
```

**Configuration:**

```json
"noise": {"distribution": "gaussian"}
```

### 3.7. Deterministic Mode

For debugging, A/B testing, and evaluation, the noise process can be disabled or seeded for reproducibility:

```json
"noise": {"distribution": "gaussian", "seed": 42}
```

When `seed` is present, the engine initializes a dedicated pseudorandom generator from that seed, producing identical emotional trajectories across runs given identical input sequences. When `seed` is `null` or absent, the system uses the platform default entropy source.

Setting `σᵢ = 0` for all dimensions also produces fully deterministic output, though this eliminates naturalistic variation entirely and is recommended only for unit testing.

---

## 4. Sentiment Signal Processing

The raw input to the ADE is the **sentiment signal** `s(t)`, a scalar in `[−1, 1]` derived from each conversational exchange. This section describes how to obtain it.

### 4.1. Extraction Methods

Three approaches are presented in order of increasing sophistication. Production deployments should consider the hybrid strategy described in §4.3.

**Keyword Heuristics (Lowest Cost)**

Maintain a compact lexicon mapping tokens to valence scores. Sum and normalize. This approach is fast and context-window-free but catastrophically brittle on sarcasm, negation, implication, and contextual nuance. It is suitable only for proof-of-concept work or as a fallback when no other method is available.

```python
# Python 3.13 — minimal keyword sentiment scorer
VALENCE: dict[str, float] = {
    "thanks": 0.3, "love": 0.5, "great": 0.4, "hate": -0.6,
    "sorry": -0.2, "angry": -0.5, "happy": 0.5, "help": 0.2,
    "disagree": -0.1, "amazing": 0.5, "terrible": -0.6,
    "trust": 0.4, "betray": -0.8, "joke": 0.2, "fear": -0.4,
}

def keyword_sentiment(text: str) -> float:
    tokens = text.lower().split()
    scores = [VALENCE[t] for t in tokens if t in VALENCE]
    if not scores:
        return 0.0
    return max(-1.0, min(1.0, sum(scores) / len(scores)))
```

**LLM Self-Assessment (Moderate Cost)**

Instruct the agent's own LLM to emit a structured sentiment annotation as part of its response cycle. This can be appended to the system prompt or handled in a preprocessing step. The primary risk is *prompt bleed* — the sentiment instruction contaminating the agent's visible output — and instruction-following variance across models.

```python
# Prompt fragment for LLM-based sentiment extraction.
# Append to the agent's internal reasoning step (not user-facing).
SENTIMENT_PROMPT = """
After processing the user's message, emit a JSON object on a
single line with the following schema before your visible reply:

{"s": <float in [-1,1]>, "c": <float in [0,1]>, "dims": {"trust": <float>, "warmth": <float>, "energy": <float>, "familiarity": <float>, "vulnerability": <float>}}

Where "s" is overall sentiment valence, "c" is your confidence
in the assessment (0 = uncertain, 1 = highly confident), and
"dims" provides per-dimension sentiment deltas. Do not explain
this object.
"""
```

Note the `"c"` (confidence) field. See §4.4 for how confidence is used.

**External Classifier (Highest Accuracy)**

Use a dedicated sentiment model (e.g., a fine-tuned distilled transformer) as a preprocessing sidecar. This adds latency and infrastructure cost but removes the sentiment burden from the primary context window entirely. Many lightweight models suitable for this purpose can run on CPU with sub-50ms inference time.

### 4.2. Per-Dimension Decomposition

For multi-dimensional emotional state, the scalar `s(t)` must be decomposed into per-dimension signals `sᵢ(t)`. The LLM self-assessment method above achieves this directly via the `dims` object. For the keyword or external classifier methods, a projection matrix `P` can map scalar sentiment to dimensional contributions:

```python
import numpy as np

# Projection matrix: rows = dimensions, columns = [positive, negative]
# Dimensions: [trust, warmth, energy, familiarity, vulnerability]
P = np.array([
    [0.8, -0.9],   # trust: strongly affected by both + and −
    [0.7, -0.4],   # warmth: more responsive to positive
    [0.5, -0.3],   # energy: moderate response
    [0.3, -0.1],   # familiarity: slow to build, slow to erode
    [0.2, -0.6],   # vulnerability: increases with negative (see safety note below)
])

def project_sentiment(s: float) -> np.ndarray:
    """Project scalar sentiment to per-dimension signals."""
    if s >= 0:
        return P[:, 0] * s
    else:
        return P[:, 1] * s  # note: s is negative, so this flips sign correctly
```

The default projection matrix is a tunable starting point, not a universal constant. The values encode reasonable psychological priors (e.g., trust is more sensitive to negative events than to positive ones), but deployers should expect to adjust the matrix based on their agent's personality and domain.

**Safety note on vulnerability:** The projection matrix encodes negative sentiment as *increasing* the vulnerability dimension. This reflects the psychological observation that emotional pain often produces a "raw" state of heightened openness. However, implementors must ensure that the LLM's behavioral coupling (§8) does not interpret elevated vulnerability during negative interactions as a signal for submissiveness, compliance, or self-deprecation. Vulnerability should modulate *emotional openness and epistemic hedging*, not deference. See §8 for the recommended behavioral mapping.

### 4.3. Recommended Hybrid Strategy

For production deployments, the most robust approach combines an external lightweight classifier for the primary signal with LLM self-assessment as a fallback and enrichment layer:

1. **Primary:** Run a lightweight sentiment classifier (local, CPU-bound) on the user's message. This produces a scalar `s(t)` and a confidence score `c(t)`.
2. **Enrichment:** If `c(t) < 0.6`, or if the message is long or contextually complex, additionally invoke the LLM self-assessment to obtain per-dimension decomposition.
3. **Fallback:** If no external classifier is available, use the LLM self-assessment exclusively. If no LLM self-assessment is configured, fall back to keyword heuristics.

This layered approach isolates the ADE from the fragility of any single extraction method.

### 4.4. Confidence Weighting

When a confidence score `c(t)` is available (from the LLM self-assessment, from the external classifier, or both), the sentiment signal should be attenuated by confidence before entering the memory accumulator:

```
sᵢ_eff(t) = sᵢ(t) · c(t)
```

Low-confidence assessments produce weaker signals. This prevents a single misclassified message (e.g., sarcasm read as sincere hostility) from creating a disproportionate perturbation in the emotional state. In effect, the system says: "I'm not sure what that meant, so I'll react less strongly."

---

## 5. The Emotional State Vector

ADF defines a default five-dimensional emotional state vector. Implementors may add, remove, or rename dimensions as appropriate.

### 5.1. Default Dimensions

| Dimension | Symbol | Description | Typical Baseline |
|-----------|--------|-------------|-----------------|
| Trust | `E_T` | Confidence in the other party's reliability and intent | 0.3 -- 0.5 |
| Warmth | `E_W` | Affective closeness, fondness, sense of care | 0.3 -- 0.6 |
| Energy | `E_N` | Engagement level, enthusiasm, conversational momentum | 0.4 -- 0.5 |
| Familiarity | `E_F` | Accumulated shared context, recognition, comfort | 0.1 -- 0.3 |
| Vulnerability | `E_V` | Willingness to expose uncertainty, emotional openness | 0.1 -- 0.3 |

### 5.2. State Vector Serialization

For context window efficiency, the full emotional state is stored as a compact JSON line:

```json
{"adf":{"v":"1.1","E":[0.42,0.55,0.48,0.31,0.18],"t":"2026-03-02T14:30:00Z"}}
```

This consumes approximately 80 tokens. The vector keys (`E[0]` through `E[4]`) correspond to the dimension order in §5.1.

### 5.3. Composite Bond Score

For contexts requiring a single scalar (e.g., alignment band evaluation, logging), a weighted composite is computed:

```
B_composite = Σ wᵢ · Eᵢ / Σ wᵢ
```

Default weights: `w = [0.30, 0.25, 0.15, 0.15, 0.15]` (trust-dominant).

---

## 6. Historical Memory Kernel

This is the mechanism that makes ADF historically sensitive. Rather than using the instantaneous sentiment `sᵢ(t)`, the ADE operates on the **decayed cumulative sentiment** `S̃ᵢ(t)` — a running, time-weighted summary of all past sentiment signals for dimension `i`:

```
S̃ᵢ(t) = Σₙ w(t − tₙ) · sᵢ(tₙ)
```

Where the sum runs over all past interaction events at times `tₙ`, and `w` is an exponential decay kernel:

```
w(Δt) = exp(−Δt / τ)
```

The parameter `τ` (tau) is the **memory time constant** — the time scale over which past events lose influence. Strictly, `τ` is the *e-folding time* (the time for a signal's contribution to decay to ~36.8% of its original value); the corresponding *half-life* is `τ · ln(2) ≈ 0.693 · τ`. Different dimensions can have different `τ` values:

| Dimension | Suggested τ | Rationale |
|-----------|-------------|-----------|
| Trust | 168 hours (7 days) | Trust is slow to build and slow to erode |
| Warmth | 48 hours | Warmth fades faster without reinforcement |
| Energy | 4 hours | Engagement is session-local |
| Familiarity | 720 hours (30 days) | Familiarity is the most persistent |
| Vulnerability | 24 hours | Vulnerability resets quickly without reciprocation |

### 6.1. Efficient Computation

Storing the entire interaction history is unnecessary. Use a **running weighted accumulator** that updates in O(1) per event:

```python
from dataclasses import dataclass, field
from time import time

@dataclass
class MemoryAccumulator:
    """O(1) exponential-decay weighted sentiment accumulator."""
    tau: float             # decay time constant in hours
    value: float = 0.0     # current accumulated (decayed) sentiment
    last_t: float = field(default_factory=time)

    def update(self, sentiment: float, t: float | None = None) -> float:
        t = t or time()
        dt = t - self.last_t
        decay = _safe_exp(-dt / (self.tau * 3600.0)) if self.tau > 0 else 0.0
        self.value = self.value * decay + sentiment
        self.last_t = t
        return self.value

    def query(self, t: float | None = None) -> float:
        """Read current decayed value without adding new data."""
        t = t or time()
        dt = t - self.last_t
        decay = _safe_exp(-dt / (self.tau * 3600.0)) if self.tau > 0 else 0.0
        return self.value * decay

def _safe_exp(x: float) -> float:
    """Clamped exp to avoid overflow."""
    return __import__("math").exp(max(-500.0, min(500.0, x)))
```

This eliminates unbounded memory growth. Each dimension requires only three floats of persistent storage: `tau`, `value`, and `last_t`.

### 6.2. Normalization

The raw accumulator output is unbounded. Normalize `S̃ᵢ(t)` to `[−1, 1]` via hyperbolic tangent:

```python
import math

def normalize_signal(raw: float, scale: float = 1.0) -> float:
    """Squash accumulated sentiment to [-1, 1] via tanh."""
    return math.tanh(raw / scale)
```

The `scale` parameter controls sensitivity. A smaller `scale` makes the system more reactive to accumulated history; a larger `scale` makes it more stable. To calibrate: `scale` should be set so that the expected steady-state range of the raw accumulator occupies roughly the `[-2, 2]` region of the tanh input. As a practical heuristic, if the agent averages `n` interactions per day at mean absolute sentiment `|s̄|`, then a reasonable starting value is:

```
scale ≈ n · |s̄| · τ_hours / 24
```

For an agent with ~20 interactions/day, `|s̄| ≈ 0.3`, and `τ = 48` hours, this gives `scale ≈ 12`. Fine-tuning from that starting point is expected.

---

## 7. Personality Baseline Calibration

The baseline vector `B = [B_T, B_W, B_N, B_F, B_V]` defines the agent's emotional resting state — its dispositional personality. This vector is the primary personality knob and should be defined in the agent's `SOUL.md`.

### 7.1. Archetype Examples

| Archetype | B_T | B_W | B_N | B_F | B_V | Description |
|-----------|-----|-----|-----|-----|-----|-------------|
| Warm Companion | 0.50 | 0.65 | 0.50 | 0.20 | 0.30 | Friendly, open, emotionally available |
| Professional Analyst | 0.40 | 0.30 | 0.55 | 0.15 | 0.10 | Competent, measured, reserved |
| Guarded Mentor | 0.30 | 0.35 | 0.45 | 0.10 | 0.15 | Cautious trust, earned warmth |
| Enthusiastic Collaborator | 0.45 | 0.55 | 0.70 | 0.25 | 0.25 | High energy, engaged, open |
| Stoic Operator | 0.35 | 0.20 | 0.40 | 0.10 | 0.05 | Minimal affect, task-focused |

### 7.2. Archetype Trajectory Signatures

Each archetype exhibits a characteristic response pattern over time. The following qualitative descriptions indicate what to expect during the first ~30 interactions with a neutral-to-positive user:

**Warm Companion:** Rapid warmth rise in the first 3-5 exchanges. Trust follows within 8-10 interactions. Energy remains stable. Vulnerability opens relatively early (by interaction ~7). Familiarity accrues steadily. After a negative event, warmth dips but recovers quickly; trust recovers more slowly.

**Professional Analyst:** Energy rises first (engagement with the task). Warmth increases slowly. Trust builds methodically. Vulnerability stays low unless the user explicitly shares personal context. The flattest trajectory of the archetypes — deliberate, measured shifts.

**Guarded Mentor:** Slowest trust curve. Warmth lags behind trust by several interactions — this agent needs to trust you before it warms to you. Energy is moderate and stable. A negative event causes a sharper trust drop than other archetypes (low baseline means the logistic term provides less damping near the floor). Recovery is slow and requires sustained positive input.

**Enthusiastic Collaborator:** Highest early energy. Warmth and trust rise in tandem. Most volatile archetype — responds strongly to both positive and negative signals. Vulnerability opens moderately. Risk: can overshoot on positive input and feel "too much too fast" if β values are not tuned down.

**Stoic Operator:** The flattest profile. Warmth and vulnerability barely move without sustained, explicit positive input. Trust rises slowly but steadily. Energy tracks task engagement. Least affected by negative events (low sensitivity) but also slowest to recover if pushed below baseline.

### 7.3. Regression Dynamics

The base regression rate `λᵢ` controls how quickly the agent returns to baseline when not receiving interaction input. Higher `λ` means faster return. Suggested defaults:

```python
LAMBDA_DEFAULTS = {
    "trust":         0.005,   # slow — trust doesn't evaporate fast
    "warmth":        0.015,   # moderate
    "energy":        0.050,   # fast — energy drops between sessions
    "familiarity":   0.002,   # very slow — you don't forget someone
    "vulnerability": 0.030,   # moderate-fast — openness closes quickly
}
```

Remember that the *effective* regression rate is `λ̃ᵢ = λᵢ · (1 − μ · E_F)` (§3.5). These base rates assume `E_F ≈ 0` (new relationship). As familiarity accrues, all channels become more resistant to passive decay.

---

## 8. Behavioral Coupling Map

The emotional state vector is only useful if it *changes the agent's behavior*. A prompt hint like `[ADF: bond=0.46 mode=new]` is descriptive but not generative — it tells the LLM what the emotional state is but does not specify what to *do* about it.

The Behavioral Coupling Map (BCM) bridges this gap. It defines a mapping from emotional state dimensions to concrete behavioral parameters that can be injected into the system prompt or used to modulate response generation.

### 8.1. Default Behavioral Mappings

| Dimension | Low Value Behavior | High Value Behavior |
|-----------|-------------------|-------------------|
| Trust | Conservative assertions, hedged claims, avoids speculation, requests confirmation before acting | Willing to speculate, offers proactive suggestions, takes initiative, shares tentative reasoning |
| Warmth | Shorter responses, formal register, fewer personal asides, task-focused | Longer responses when appropriate, conversational register, humor permitted, expresses care |
| Energy | Concise answers, minimal elaboration, waits for prompts | Elaborates voluntarily, asks follow-up questions, introduces related topics |
| Familiarity | Explains context fully, avoids assumptions about shared knowledge, uses formal address | References past interactions naturally, uses shorthand, assumes shared context, uses casual address |
| Vulnerability | Confident tone, avoids expressing uncertainty, presents conclusions | Acknowledges uncertainty, thinks aloud, shares reasoning process, admits limitations |

### 8.2. Prompt Injection Format

The BCM can be injected as a compact behavioral directive. The `prompt_hint()` method generates a rich output:

```
[ADF bond=0.58 mode=building | tone=conversational, speculation=moderate, initiative=low, hedging=moderate]
```

The behavioral modifiers after the pipe (`|`) are derived from the mapping table and are **enabled by default** (`"behavioral_coupling": true` in the ADF config). When all dimensions are in the neutral band (0.35-0.55), no modifiers are emitted and the hint reduces to the compact `[ADF bond=... mode=...]` form — this is correct behavior, as there is nothing behaviorally notable to signal. In practice, after even a few interactions, at least one dimension will typically be outside the neutral band, and the BCM modifiers will appear. Setting `"behavioral_coupling": false` disables modifiers entirely and always emits the compact form; this is intended only for ultra-low-token deployments.

### 8.3. Extended Prompt Template

For deployments that can afford a larger context budget (~80 tokens), a more explicit behavioral block can be injected:

```markdown
<!-- ADF Behavioral State -->
You are in a BUILDING_RAPPORT phase with this user.
- Trust is moderate: offer suggestions but flag uncertainty.
- Warmth is above average: conversational tone is appropriate.
- Energy is moderate: engage actively but don't over-elaborate.
- Familiarity is low: don't assume shared context from prior sessions.
- Vulnerability is low: present conclusions confidently.
```

This extended format trades context tokens for interpretive precision — the LLM does not need to decode abbreviations or infer behavioral implications from numeric state.

---

## 9. Integration with OpenClaw

ADF is designed to operate within the OpenClaw agent framework via `SOUL.md` and the heartbeat/memory architecture. The following section provides concrete integration guidance.

### 9.1. SOUL.md Embedding

Append the ADF configuration block to the agent's `SOUL.md` file. Use a fenced section to keep it parseable by both humans and automated tooling:

````markdown
## Affective Dynamics Configuration

<!-- ADF v1.1 — do not edit below this line manually unless you know what you're doing -->

```json
{
  "adf_version": "1.1",
  "dimensions": ["trust", "warmth", "energy", "familiarity", "vulnerability"],
  "baseline": [0.45, 0.55, 0.50, 0.20, 0.25],
  "capacity": [1.0, 1.0, 1.0, 1.0, 1.0],
  "beta": [0.10, 0.12, 0.15, 0.05, 0.08],
  "lambda": [0.005, 0.015, 0.050, 0.002, 0.030],
  "tau_hours": [168, 48, 4, 720, 24],
  "sigma": [0.02, 0.03, 0.05, 0.01, 0.02],
  "tanh_scale": [1.0, 1.0, 1.0, 1.0, 1.0],
  "noise": {"distribution": "gaussian", "seed": null},
  "kappa": [
    [0.00, 0.02, 0.00, 0.01, 0.00],
    [0.03, 0.00, 0.01, 0.01, 0.02],
    [0.01, 0.02, 0.00, 0.00, 0.00],
    [0.00, 0.00, 0.00, 0.00, 0.00],
    [0.00, 0.03, 0.00, 0.00, 0.00]
  ],
  "familiarity_modulation": 0.5,
  "regression_floor": 0.1,
  "sentiment_method": "llm_self_assess",
  "behavioral_coupling": true,
  "extensions": []
}
```
````

### 9.2. State Persistence via Memory File

OpenClaw agents maintain persistent memory through local files. ADF state should be stored in the agent's memory directory as a single-line JSON entry, updated after each interaction cycle:

```
~/.openclaw/workspaces/<agent>/memory/adf_state.json
```

Contents:

```json
{"E":[0.42,0.55,0.48,0.31,0.18],"acc":[[168,0.12,1709400000],[48,0.08,1709400000],[4,0.01,1709400000],[720,0.15,1709400000],[24,-0.02,1709400000]],"n":47,"t":"2026-03-02T14:30:00Z"}
```

Each entry in `acc` is `[tau, accumulated_value, last_timestamp]` — the three floats from the `MemoryAccumulator` (§6.1). The `n` field is the interaction count. The entire state fits within approximately 280 bytes.

### 9.3. Heartbeat Integration

OpenClaw's heartbeat runs periodically (default: every 30 minutes). During the heartbeat, the ADF module should:

1. Load `adf_state.json`
2. Apply time-decay to all accumulators (call `query()` with current time)
3. Compute effective regression rate: `lambda_eff_i = lambda_i * (1 - mu * E_F)`
4. Apply baseline regression: `Eᵢ += -lambda_eff_i · (Eᵢ − Bᵢ) · dt`
5. Apply inter-dimensional coupling: `Eᵢ += Σⱼ κᵢⱼ · (Eⱼ − Eᵢ) · dt`
6. Inject noise: `Eᵢ += σᵢ · ξ() · sqrt(dt)`
7. Clamp all `Eᵢ` to `[0, Kᵢ]`
8. Write updated state back to `adf_state.json`

This ensures the emotional state evolves even between conversations — the agent "misses" long-absent users (warmth decays toward baseline), "forgets" short-term energy spikes, and maintains familiarity over extended periods. Critically, the familiarity-scaled regression (step 3) means that deeply established relationships resist passive decay: a daily user who takes a week-long vacation will find the agent in roughly the same emotional posture on return.

### 9.4. Soul Spec Compatibility

For deployments using the Soul Spec standard (`soul.json` manifest), register ADF as a capability:

```json
{
  "specVersion": "0.4",
  "name": "my-agent",
  "capabilities": {
    "affective_dynamics": {
      "version": "1.1",
      "config_file": "SOUL.md",
      "state_file": "memory/adf_state.json"
    }
  }
}
```

---

## 10. Optional Extensions

The following extensions are modular add-ons to the core ADE. Each introduces additional computational and context window cost, documented per extension. Enable them by adding their identifier to the `extensions` array in the ADF configuration block.

---

### Extension A: Attachment Style Dynamics

**Identifier:** `attachment_style`  
**Context Cost:** ~50 tokens  
**Concept:** Models the agent's attachment behavior using a two-dimensional parameterization inspired by attachment theory (Bartholomew & Horowitz, 1991). The two axes are **anxiety** (fear of abandonment) and **avoidance** (discomfort with closeness).

Attachment style modulates the core ADE parameters dynamically:

```
βᵢ_eff = βᵢ · (1 + anxiety · δ_positive − avoidance · δ_negative)
```

Where `δ_positive` is 1 when `S̃ᵢ > 0` (else 0) and `δ_negative` is 1 when `S̃ᵢ < 0` (else 0). An anxious agent amplifies positive signals (seeks closeness intensely). An avoidant agent amplifies negative signals (withdraws faster).

```python
@dataclass
class AttachmentStyle:
    anxiety: float = 0.0     # [0, 1] — 0 = secure, 1 = highly anxious
    avoidance: float = 0.0   # [0, 1] — 0 = secure, 1 = highly avoidant

    def modulate_beta(self, beta: float, sentiment: float) -> float:
        if sentiment >= 0:
            return beta * (1.0 + self.anxiety * 0.5)
        else:
            return beta * (1.0 + self.avoidance * 0.5)
```

**Configuration addition:**

```json
"attachment": {"anxiety": 0.2, "avoidance": 0.1}
```

**Personality implications:** A "secure" agent (`anxiety=0, avoidance=0`) behaves per the unmodified ADE. An "anxious-preoccupied" agent (`anxiety=0.7, avoidance=0.1`) bonds quickly but is sensitive to withdrawal. A "dismissive-avoidant" agent (`anxiety=0.1, avoidance=0.7`) is slow to warm and quick to pull back.

---

### Extension B: Emotional Momentum (Inertia)

**Identifier:** `emotional_momentum`  
**Context Cost:** ~30 tokens  
**Concept:** Adds a second-order derivative term to the ADE, modeling *emotional inertia* — the tendency for emotional trajectories to continue in their current direction even when the driving signal changes.

The modified equation becomes:

```
d²Eᵢ/dt² + γᵢ · dEᵢ/dt = [original ADE right-hand side]
```

Where `γᵢ` is a damping coefficient. High `γ` means rapid response to signal changes (low inertia). Low `γ` means the emotional state "coasts" — a recently positive trajectory continues upward briefly even after a neutral or mildly negative input. This prevents "emotional whiplash" where a single apology after sustained negativity instantly restores the agent's disposition.

In discrete implementation, this is handled via a velocity variable:

```python
@dataclass
class MomentumState:
    velocity: list[float]   # dE/dt for each dimension
    gamma: list[float]      # damping coefficients

    def step(self, force: list[float], dt: float) -> list[float]:
        """Returns delta_E for each dimension."""
        delta_e = []
        for i, (v, g, f) in enumerate(zip(self.velocity, self.gamma, force)):
            # Update velocity: dv/dt = f - gamma * v
            new_v = v + (f - g * v) * dt
            self.velocity[i] = new_v
            delta_e.append(new_v * dt)
        return delta_e
```

**Configuration addition:**

```json
"momentum": {"gamma": [2.0, 2.5, 4.0, 1.5, 3.0]}
```

**Tradeoffs:** This extension produces more natural-feeling emotional transitions but increases the risk of oscillatory behavior if `γ` values are set too low. Recommended: keep `γ >= 1.5` for all dimensions.

---

### Extension C: Trust Hysteresis

**Identifier:** `trust_hysteresis`  
**Context Cost:** ~20 tokens  
**Concept:** Models the asymmetry in trust dynamics — trust is slow to build but fast to break. This is implemented as an asymmetric `β` for the trust dimension specifically:

```
β_T_eff = β_T · α_build      when S̃_T(t) > 0
β_T_eff = β_T · α_break      when S̃_T(t) < 0
```

With `α_break > α_build` (typical ratio: 2:1 to 4:1).

```python
def hysteretic_beta(
    beta: float,
    sentiment: float,
    alpha_build: float = 1.0,
    alpha_break: float = 3.0,
) -> float:
    """Asymmetric trust sensitivity."""
    if sentiment >= 0:
        return beta * alpha_build
    return beta * alpha_break
```

**Configuration addition:**

```json
"trust_hysteresis": {"alpha_build": 1.0, "alpha_break": 3.0}
```

This produces the widely observed behavioral pattern where a single betrayal event can undo months of cooperative history — a property absent from symmetric models.

---

### Extension D: Novelty and Habituation

**Identifier:** `novelty_habituation`  
**Context Cost:** ~40 tokens  
**Concept:** Models the diminishing emotional impact of repeated stimuli and the heightened impact of novel ones. Maintains a short-term "stimulus fingerprint" buffer. When incoming sentiment is similar to recent history, its effective magnitude is reduced. When it diverges significantly, it receives an amplification bonus.

```python
from collections import deque

class NoveltyFilter:
    def __init__(self, window: int = 10, novelty_boost: float = 1.5,
                 habituation_floor: float = 0.3):
        self.history: deque[float] = deque(maxlen=window)
        self.boost = novelty_boost
        self.floor = habituation_floor

    def filter(self, sentiment: float) -> float:
        if not self.history:
            self.history.append(sentiment)
            return sentiment * self.boost  # first interaction is always novel

        mean = sum(self.history) / len(self.history)
        deviation = abs(sentiment - mean)
        # Scale factor: floor at mean, up to boost at max deviation
        scale = self.floor + (self.boost - self.floor) * min(deviation / 1.0, 1.0)
        self.history.append(sentiment)
        return sentiment * scale
```

**Configuration addition:**

```json
"novelty": {"window": 10, "boost": 1.5, "floor": 0.3}
```

**Effect:** Prevents emotional flatness from repetitive positive interactions (the agent doesn't keep getting happier from identical exchanges) and makes surprising events — both positive and negative — hit harder. This is particularly valuable for long-running agent relationships where habituation is a real risk. It also forces users to engage in genuinely new ways to continue moving the bond score.

---

### Extension E: Relational Context Tags

**Identifier:** `relational_context`  
**Context Cost:** ~60 tokens  
**Concept:** Maintains a small set of categorical tags that describe the current relational context, enabling the agent to modulate its behavior not just by emotional state but by relationship *type*. Tags are inferred from interaction patterns and stored alongside the state vector.

Example tag set:

```python
from enum import Enum

class RelationalMode(Enum):
    NEW_ACQUAINTANCE = "new"
    BUILDING_RAPPORT = "building"
    ESTABLISHED_TRUST = "established"
    STRAINED = "strained"
    RECOVERING = "recovering"
    DORMANT = "dormant"

def classify_relation(e_vec: list[float], history_len: int,
                      last_interaction_hours: float) -> RelationalMode:
    trust, warmth = e_vec[0], e_vec[1]
    if history_len < 3:
        return RelationalMode.NEW_ACQUAINTANCE
    if last_interaction_hours > 168:
        return RelationalMode.DORMANT
    if trust < 0.25 and warmth < 0.25:
        return RelationalMode.STRAINED
    if trust < 0.35:
        return RelationalMode.RECOVERING
    if trust > 0.55 and warmth > 0.50:
        return RelationalMode.ESTABLISHED_TRUST
    return RelationalMode.BUILDING_RAPPORT
```

**Configuration addition:**

```json
"relational_context": {"enabled": true}
```

The relational mode tag can be injected into the system prompt to modulate tone:

```markdown
[ADF Context: mode=established_trust, composite_bond=0.62]
```

This gives the LLM a high-level behavioral hint without requiring it to interpret raw numeric state.

---

### Extension F: Bifurcation Triggers

**Identifier:** `bifurcation_triggers`  
**Context Cost:** ~40 tokens  
**Concept:** Introduces threshold-driven state transitions that modify the ADE parameters themselves. Without this extension, the ADE produces smooth, continuous emotional trajectories. Real relationships are not always smooth — there are moments where accumulated pressure produces a qualitative shift in relational posture: a wall going up, a grudge crystallizing, or conversely, a breakthrough moment of trust.

Bifurcation triggers define threshold conditions on the emotional state vector that, when crossed, temporarily modify ADE parameters to model these discontinuities.

```python
@dataclass
class BifurcationTrigger:
    dimension: int            # index of the dimension to monitor
    threshold: float          # value at which the trigger fires
    direction: str            # "below" or "above"
    lambda_multiplier: float  # multiply regression rates by this
    beta_multiplier: float    # multiply sensitivity by this
    duration_hours: float     # how long the parameter shift persists
    activated_at: float = 0.0 # timestamp of activation (0 = inactive)

    def check(self, e_vec: list[float], t: float) -> bool:
        """Return True if trigger should activate."""
        if self.activated_at > 0:
            # Already active — check if duration has elapsed
            if (t - self.activated_at) / 3600.0 > self.duration_hours:
                self.activated_at = 0.0  # deactivate
            return self.activated_at > 0
        val = e_vec[self.dimension]
        if self.direction == "below" and val < self.threshold:
            self.activated_at = t
            return True
        if self.direction == "above" and val > self.threshold:
            self.activated_at = t
            return True
        return False
```

**Default triggers:**

```json
"bifurcation_triggers": [
  {
    "dimension": 0, "threshold": 0.15, "direction": "below",
    "lambda_multiplier": 2.0, "beta_multiplier": 0.3,
    "duration_hours": 72,
    "note": "Trust crisis: regression accelerates, positive signals dampened for 3 days"
  },
  {
    "dimension": 0, "threshold": 0.70, "direction": "above",
    "lambda_multiplier": 0.5, "beta_multiplier": 1.5,
    "duration_hours": 48,
    "note": "Trust breakthrough: regression slows, positive signals amplified"
  }
]
```

**Effect:** When trust drops below 0.15, the agent enters a "guarded" phase — regression toward baseline accelerates (it *wants* to retreat to neutral), and positive sentiment signals are dampened (it doesn't trust the repair attempt yet). This persists for 72 hours regardless of input, modeling the real phenomenon of needing time to recover from a breach. Conversely, when trust exceeds 0.70, the agent enters a "breakthrough" phase where the bond deepens more readily and resists decay.

This extension addresses the "too smooth" property of the base ADE and creates true phase transitions in the relational dynamics.

**Trigger stacking policy:** When multiple bifurcation triggers are active simultaneously, their multipliers compound multiplicatively. To prevent degenerate parameter values when many triggers fire at once, the compound product is clamped to `[0.2, 5.0]` for both `lambda_multiplier` and `beta_multiplier`. This ensures that even aggressive trigger configurations cannot fully suppress sensitivity or produce runaway regression. Deployers adding custom triggers beyond the defaults should verify that their intended compound effects fall within this band.

---

### Extension G: Mood Congruence

**Identifier:** `mood_congruence`  
**Context Cost:** ~25 tokens  
**Concept:** Models the cognitive bias known as *mood-congruent processing* — the tendency to interpret ambiguous stimuli in a manner consistent with current emotional state. When an agent is in a positive emotional state, it is more likely to interpret neutral input as mildly positive. When in a negative state, neutral input reads as mildly negative.

This is implemented as a bias term applied to the sentiment signal before it enters the memory accumulator:

```
sᵢ_biased(t) = sᵢ(t) + η · (Eᵢ − 0.5) · (1 − |sᵢ(t)|)
```

Where `η` is the mood congruence strength (default: 0.15). The `(1 − |sᵢ(t)|)` term ensures that the bias only affects ambiguous signals — strongly positive or negative input is interpreted as-is.

```python
def apply_mood_congruence(
    sentiment: float, current_e: float, eta: float = 0.15
) -> float:
    """Bias ambiguous sentiment toward current emotional state."""
    ambiguity = 1.0 - abs(sentiment)
    bias = eta * (current_e - 0.5) * ambiguity
    return max(-1.0, min(1.0, sentiment + bias))
```

**Configuration addition:**

```json
"mood_congruence": {"eta": 0.15}
```

**Effect:** Creates mild positive feedback loops that model emotional inertia at the perceptual level. A happy agent stays happy slightly longer because it interprets ambiguous input charitably. A hurt agent stays hurt slightly longer because it reads neutrality as coldness. The effect is subtle by design — strong `η` values (above ~0.3) risk runaway reinforcement and should be paired with the baseline regression term to maintain stability.

**Affective lock-in risk:** At elevated `η`, the feedback loop can produce a pathological spiral: if the agent enters a strongly negative state, mood congruence causes it to interpret neutral or mildly positive input as negative, which reinforces the negative state, which deepens the bias. In practice, this manifests as an agent that reads jokes as mockery and sincerity as sarcasm — a state recoverable only by passive heartbeat regression over time. The baseline regression term (`λ̃`) is the structural safeguard against true lock-in: as long as `λ̃ > 0`, the state will eventually regress toward baseline regardless of the congruence bias. However, prolonged negative bias before recovery is still undesirable. Recommended: keep `η ≤ 0.2` for production deployments, and ensure that the base regression rates in §7.3 are not set so low that recovery takes unreasonably long.

---

## 11. Context Window Budget Analysis

Context window efficiency is a first-order design constraint for any system intended to be injected into agent prompts. The following table estimates token costs for each ADF component:

| Component | Approx. Tokens | Required? |
|-----------|----------------|-----------|
| ADF config block in SOUL.md | ~170 | Yes (loaded at boot, not necessarily in live prompt) |
| State vector (inline JSON) | ~80 | Yes |
| Sentiment prompt fragment | ~80 | If using LLM self-assess |
| Behavioral coupling hint | ~30 | Recommended |
| Extended behavioral block | ~80 | Optional (alternative to hint) |
| Relational context tag | ~15 | Optional |
| **Minimal total (in live prompt)** | **~125** | |
| **Recommended total** | **~210** | |
| **Full (all extensions + extended BCM)** | **~400** | |

For comparison, the OpenClaw default `SOUL.md` template consumes roughly 800-1200 tokens. ADF's recommended overhead is approximately 18-26% of the existing soul budget — well within acceptable bounds for most deployments.

A key optimization: the full ADF config block does not need to reside in the live prompt. It is loaded from `SOUL.md` at boot and used to initialize the engine. Only the *state output* (state vector + behavioral hint) needs to be injected per-turn.

### 11.1. Strategies for Further Reduction

If context pressure is extreme:

1. **Omit the config block** from the live prompt; load it from file at boot and reference only the state vector inline.
2. **Use abbreviated dimension keys:** `[T,W,N,F,V]` instead of full names.
3. **Quantize state values** to single decimal precision (e.g., `0.4` instead of `0.4231`).
4. **Emit only the composite bond score** and relational mode tag instead of the full vector:
   ```
   [ADF: bond=0.58 mode=building]
   ```
   Cost: ~12 tokens.

---

## 12. Reference Implementation

The following is a self-contained Python 3.13 module that implements the core ADE with all extensions. It is intended as a reference, not production code. Adapt as needed for your deployment environment.

```python
"""
adf.py — Affective Dynamics Framework reference implementation.
Version: 1.1.0
Author: h8rt3rmin8r <h8rt3rmin8r@gmail.com>
License: MIT

Requires: Python >= 3.13 (uses modern type syntax)
Dependencies: None (stdlib only)
"""

from __future__ import annotations

import json
import math
import random
from dataclasses import dataclass, field
from time import time
from enum import Enum

# ─── Constants ──────────────────────────────────────────────────────

DIMENSIONS = ("trust", "warmth", "energy", "familiarity", "vulnerability")
SECONDS_PER_HOUR = 3600.0

# ─── Noise ──────────────────────────────────────────────────────────

def _noise_sample(distribution: str, rng: random.Random) -> float:
    """Sample from the configured noise distribution."""
    if distribution == "laplace":
        u = rng.random() - 0.5
        return -math.copysign(1, u) * math.log(1 - 2 * abs(u)) / math.sqrt(2)
    return rng.gauss(0, 1)

def _safe_exp(x: float) -> float:
    return math.exp(max(-500.0, min(500.0, x)))

# ─── Memory Accumulator ────────────────────────────────────────────

@dataclass
class MemoryAccumulator:
    tau: float
    value: float = 0.0
    last_t: float = field(default_factory=time)

    def update(self, sentiment: float, t: float | None = None) -> float:
        t = t or time()
        dt = max(t - self.last_t, 0.0)
        decay = _safe_exp(-dt / (self.tau * SECONDS_PER_HOUR))
        self.value = self.value * decay + sentiment
        self.last_t = t
        return self.value

    def query(self, t: float | None = None) -> float:
        t = t or time()
        dt = max(t - self.last_t, 0.0)
        decay = _safe_exp(-dt / (self.tau * SECONDS_PER_HOUR))
        return self.value * decay

    def to_list(self) -> list[float]:
        return [self.tau, self.value, self.last_t]

    @classmethod
    def from_list(cls, data: list[float]) -> MemoryAccumulator:
        return cls(tau=data[0], value=data[1], last_t=data[2])

# ─── Relational Mode ───────────────────────────────────────────────

class RelationalMode(Enum):
    NEW_ACQUAINTANCE = "new"
    BUILDING_RAPPORT = "building"
    ESTABLISHED_TRUST = "established"
    STRAINED = "strained"
    RECOVERING = "recovering"
    DORMANT = "dormant"

# ─── Bifurcation Triggers ──────────────────────────────────────────

@dataclass
class BifurcationTrigger:
    dimension: int
    threshold: float
    direction: str            # "below" or "above"
    lambda_multiplier: float
    beta_multiplier: float
    duration_hours: float
    activated_at: float = 0.0

    def check(self, e_vec: list[float], t: float) -> bool:
        if self.activated_at > 0:
            if (t - self.activated_at) / SECONDS_PER_HOUR > self.duration_hours:
                self.activated_at = 0.0
            return self.activated_at > 0
        val = e_vec[self.dimension]
        fired = (
            (self.direction == "below" and val < self.threshold)
            or (self.direction == "above" and val > self.threshold)
        )
        if fired:
            self.activated_at = t
        return fired

    @classmethod
    def from_dict(cls, d: dict) -> BifurcationTrigger:
        return cls(
            dimension=d["dimension"], threshold=d["threshold"],
            direction=d["direction"],
            lambda_multiplier=d["lambda_multiplier"],
            beta_multiplier=d["beta_multiplier"],
            duration_hours=d["duration_hours"],
        )

# ─── Configuration ──────────────────────────────────────────────────

@dataclass
class ADFConfig:
    baseline: list[float]
    capacity: list[float]
    beta: list[float]
    lam: list[float]          # "lambda" in config JSON; renamed to avoid keyword
    tau_hours: list[float]
    sigma: list[float]
    # Coupling, noise, and behavioral options
    kappa: list[list[float]] | None = None
    tanh_scale: list[float] | None = None  # per-dimension normalization scale
    familiarity_mu: float = 0.5
    regression_floor: float = 0.1  # minimum familiarity-modulated regression factor
    noise_distribution: str = "gaussian"
    noise_seed: int | None = None
    behavioral_coupling: bool = True
    # Extension: attachment
    anxiety: float = 0.0
    avoidance: float = 0.0
    # Extension: momentum
    gamma: list[float] | None = None
    # Extension: trust hysteresis
    alpha_build: float = 1.0
    alpha_break: float = 3.0
    # Extension: novelty
    novelty_window: int = 10
    novelty_boost: float = 1.5
    novelty_floor: float = 0.3
    # Extension: bifurcation triggers
    bifurcation_triggers: list[BifurcationTrigger] | None = None
    # Extension: mood congruence
    mood_congruence_eta: float = 0.0

    @classmethod
    def from_dict(cls, d: dict) -> ADFConfig:
        noise_cfg = d.get("noise", {})
        triggers = d.get("bifurcation_triggers")
        return cls(
            baseline=d["baseline"],
            capacity=d.get("capacity", [1.0] * len(d["baseline"])),
            beta=d["beta"],
            lam=d["lambda"],
            tau_hours=d["tau_hours"],
            sigma=d["sigma"],
            kappa=d.get("kappa"),
            tanh_scale=d.get("tanh_scale"),
            familiarity_mu=d.get("familiarity_modulation", 0.5),
            regression_floor=d.get("regression_floor", 0.1),
            noise_distribution=noise_cfg.get("distribution", "gaussian"),
            noise_seed=noise_cfg.get("seed"),
            behavioral_coupling=d.get("behavioral_coupling", True),
            anxiety=d.get("attachment", {}).get("anxiety", 0.0),
            avoidance=d.get("attachment", {}).get("avoidance", 0.0),
            gamma=d.get("momentum", {}).get("gamma"),
            alpha_build=d.get("trust_hysteresis", {}).get("alpha_build", 1.0),
            alpha_break=d.get("trust_hysteresis", {}).get("alpha_break", 3.0),
            novelty_window=d.get("novelty", {}).get("window", 10),
            novelty_boost=d.get("novelty", {}).get("boost", 1.5),
            novelty_floor=d.get("novelty", {}).get("floor", 0.3),
            bifurcation_triggers=(
                [BifurcationTrigger.from_dict(t) for t in triggers]
                if triggers else None
            ),
            mood_congruence_eta=d.get("mood_congruence", {}).get("eta", 0.0),
        )


# ─── State ──────────────────────────────────────────────────────────

@dataclass
class ADFState:
    E: list[float]
    accumulators: list[MemoryAccumulator]
    velocity: list[float] | None = None
    novelty_history: list[float] = field(default_factory=list)
    interaction_count: int = 0
    last_interaction_t: float = field(default_factory=time)

    def to_dict(self) -> dict:
        return {
            "E": [round(e, 4) for e in self.E],
            "acc": [a.to_list() for a in self.accumulators],
            "vel": self.velocity,
            "nov": self.novelty_history[-20:],
            "n": self.interaction_count,
            "t": self.last_interaction_t,
        }

    @classmethod
    def from_dict(cls, d: dict, n_dims: int) -> ADFState:
        return cls(
            E=d["E"],
            accumulators=[MemoryAccumulator.from_list(a) for a in d["acc"]],
            velocity=d.get("vel"),
            novelty_history=d.get("nov", []),
            interaction_count=d.get("n", 0),
            last_interaction_t=d.get("t", time()),
        )

    @classmethod
    def initialize(cls, config: ADFConfig) -> ADFState:
        n = len(config.baseline)
        return cls(
            E=list(config.baseline),
            accumulators=[
                MemoryAccumulator(tau=config.tau_hours[i]) for i in range(n)
            ],
            velocity=[0.0] * n if config.gamma else None,
            novelty_history=[],
            interaction_count=0,
            last_interaction_t=time(),
        )


# ─── Behavioral Coupling Map ───────────────────────────────────────

# Maps (dimension_index, threshold_direction) to behavioral descriptors
BCM_DESCRIPTORS = {
    (0, "high"): "speculation=open, initiative=high",
    (0, "low"):  "speculation=guarded, initiative=low",
    (1, "high"): "tone=conversational, humor=permitted",
    (1, "low"):  "tone=formal, humor=minimal",
    (2, "high"): "elaboration=active, follow_ups=yes",
    (2, "low"):  "elaboration=concise, follow_ups=no",
    (3, "high"): "context=assumed, address=casual",
    (3, "low"):  "context=explicit, address=formal",
    (4, "high"): "hedging=open, reasoning=visible",
    (4, "low"):  "hedging=minimal, reasoning=conclusions_only",
}

def _bcm_hint(e_vec: list[float]) -> str:
    """Generate behavioral coupling modifiers from state vector."""
    parts = []
    for i, e in enumerate(e_vec):
        key = (i, "high" if e > 0.55 else "low" if e < 0.35 else None)
        if key[1] and key in BCM_DESCRIPTORS:
            parts.append(BCM_DESCRIPTORS[key])
    return ", ".join(parts) if parts else "baseline"


# ─── Core Engine ────────────────────────────────────────────────────

class ADFEngine:
    """Core Affective Dynamics Framework engine."""

    def __init__(self, config: ADFConfig, state: ADFState | None = None):
        self.cfg = config
        self.state = state or ADFState.initialize(config)
        self.n_dims = len(config.baseline)
        # Seeded RNG for reproducibility
        if config.noise_seed is not None:
            self.rng = random.Random(config.noise_seed)
        else:
            self.rng = random.Random()

    def process_interaction(
        self, sentiments: list[float], t: float | None = None,
        confidence: float = 1.0,
    ) -> dict:
        """
        Process one interaction event.

        Args:
            sentiments: Per-dimension sentiment values in [-1, 1].
            t: Event timestamp (defaults to now).
            confidence: Sentiment confidence in [0, 1] (default 1.0).

        Returns:
            Dictionary with updated state, composite bond, and relational mode.
        """
        t = t or time()
        dt = max(t - self.state.last_interaction_t, 1.0)
        dt_norm = min(dt / SECONDS_PER_HOUR, 24.0)

        # Check bifurcation triggers (compound multipliers clamped to [0.2, 5.0])
        bif_lambda_mult = 1.0
        bif_beta_mult = 1.0
        if self.cfg.bifurcation_triggers:
            for trigger in self.cfg.bifurcation_triggers:
                if trigger.check(self.state.E, t):
                    bif_lambda_mult *= trigger.lambda_multiplier
                    bif_beta_mult *= trigger.beta_multiplier
            bif_lambda_mult = max(0.2, min(5.0, bif_lambda_mult))
            bif_beta_mult = max(0.2, min(5.0, bif_beta_mult))

        # Familiarity-scaled regression (clamped to prevent negative/zero rates)
        e_f = self.state.E[3]  # familiarity dimension
        fam_factor = max(self.cfg.regression_floor,
                         1.0 - self.cfg.familiarity_mu * e_f)

        for i in range(self.n_dims):
            s_i = sentiments[i] * confidence  # confidence weighting

            # Mood congruence (Extension G)
            if self.cfg.mood_congruence_eta > 0:
                ambiguity = 1.0 - abs(s_i)
                bias = self.cfg.mood_congruence_eta * (
                    self.state.E[i] - 0.5
                ) * ambiguity
                s_i = max(-1.0, min(1.0, s_i + bias))

            # Novelty filter (Extension D)
            s_i = self._novelty_filter(s_i)

            # Update memory accumulator
            self.state.accumulators[i].update(s_i, t)
            raw_signal = self.state.accumulators[i].query(t)
            scl = self.cfg.tanh_scale[i] if self.cfg.tanh_scale else 1.0
            s_tilde = math.tanh(raw_signal / scl)

            # Compute effective beta
            beta_eff = self.cfg.beta[i] * bif_beta_mult

            # Attachment modulation (Extension A)
            if s_tilde >= 0:
                beta_eff *= (1.0 + self.cfg.anxiety * 0.5)
            else:
                beta_eff *= (1.0 + self.cfg.avoidance * 0.5)

            # Trust hysteresis (Extension C)
            if i == 0:
                if s_tilde >= 0:
                    beta_eff *= self.cfg.alpha_build
                else:
                    beta_eff *= self.cfg.alpha_break

            E_i = self.state.E[i]
            K_i = self.cfg.capacity[i]

            # Core ADE force
            logistic = E_i * (1.0 - E_i / K_i)
            growth = beta_eff * s_tilde * logistic
            lam_eff = self.cfg.lam[i] * fam_factor * bif_lambda_mult
            regression = -lam_eff * (E_i - self.cfg.baseline[i])
            noise = self.cfg.sigma[i] * _noise_sample(
                self.cfg.noise_distribution, self.rng
            ) * math.sqrt(dt_norm)

            # Inter-dimensional coupling
            coupling = 0.0
            if self.cfg.kappa:
                for j in range(self.n_dims):
                    if j != i:
                        coupling += self.cfg.kappa[i][j] * (
                            self.state.E[j] - E_i
                        )

            force = growth + regression + coupling + noise

            # Momentum (Extension B)
            if self.state.velocity is not None and self.cfg.gamma:
                gamma_i = self.cfg.gamma[i]
                v = self.state.velocity[i]
                new_v = v + (force - gamma_i * v) * dt_norm
                self.state.velocity[i] = new_v
                delta_e = new_v * dt_norm
            else:
                delta_e = force * dt_norm

            self.state.E[i] = max(0.0, min(K_i, E_i + delta_e))

        self.state.interaction_count += 1
        self.state.last_interaction_t = t

        return self._build_output(t)

    def heartbeat(self, t: float | None = None) -> dict:
        """
        Passive update (no new interaction). Called by OpenClaw heartbeat.
        Applies decay, regression, coupling, and noise only.
        """
        t = t or time()
        dt = max(t - self.state.last_interaction_t, 1.0)
        dt_norm = min(dt / SECONDS_PER_HOUR, 24.0)

        e_f = self.state.E[3]
        fam_factor = max(self.cfg.regression_floor,
                         1.0 - self.cfg.familiarity_mu * e_f)

        # Check bifurcation triggers (clamped)
        bif_lambda_mult = 1.0
        if self.cfg.bifurcation_triggers:
            for trigger in self.cfg.bifurcation_triggers:
                if trigger.check(self.state.E, t):
                    bif_lambda_mult *= trigger.lambda_multiplier
            bif_lambda_mult = max(0.2, min(5.0, bif_lambda_mult))

        for i in range(self.n_dims):
            E_i = self.state.E[i]
            lam_eff = self.cfg.lam[i] * fam_factor * bif_lambda_mult
            regression = -lam_eff * (E_i - self.cfg.baseline[i])
            noise = self.cfg.sigma[i] * _noise_sample(
                self.cfg.noise_distribution, self.rng
            ) * math.sqrt(dt_norm)

            coupling = 0.0
            if self.cfg.kappa:
                for j in range(self.n_dims):
                    if j != i:
                        coupling += self.cfg.kappa[i][j] * (
                            self.state.E[j] - E_i
                        )

            delta_e = (regression + coupling + noise) * dt_norm
            K_i = self.cfg.capacity[i]
            self.state.E[i] = max(0.0, min(K_i, E_i + delta_e))

        return self._build_output(t)

    def composite_bond(self) -> float:
        weights = [0.30, 0.25, 0.15, 0.15, 0.15]
        return sum(w * e for w, e in zip(weights, self.state.E)) / sum(weights)

    def relational_mode(self, t: float | None = None) -> RelationalMode:
        t = t or time()
        hours_since = (t - self.state.last_interaction_t) / SECONDS_PER_HOUR
        trust, warmth = self.state.E[0], self.state.E[1]
        n = self.state.interaction_count

        if n < 3:
            return RelationalMode.NEW_ACQUAINTANCE
        if hours_since > 168:
            return RelationalMode.DORMANT
        if trust < 0.25 and warmth < 0.25:
            return RelationalMode.STRAINED
        if trust < 0.35:
            return RelationalMode.RECOVERING
        if trust > 0.55 and warmth > 0.50:
            return RelationalMode.ESTABLISHED_TRUST
        return RelationalMode.BUILDING_RAPPORT

    def prompt_hint(self, t: float | None = None) -> str:
        """Generate a compact prompt injection string."""
        bond = self.composite_bond()
        mode = self.relational_mode(t).value
        bcm = _bcm_hint(self.state.E) if self.cfg.behavioral_coupling else ""
        base = f"[ADF bond={bond:.2f} mode={mode}"
        if bcm and bcm != "baseline":
            return f"{base} | {bcm}]"
        return f"{base}]"

    # ── Private ──────────────────────────────────────────────────

    def _novelty_filter(self, s: float) -> float:
        hist = self.state.novelty_history
        if not hist:
            self.state.novelty_history.append(s)
            return s * self.cfg.novelty_boost

        mean = sum(hist) / len(hist)
        deviation = abs(s - mean)
        scale = self.cfg.novelty_floor + (
            self.cfg.novelty_boost - self.cfg.novelty_floor
        ) * min(deviation, 1.0)
        self.state.novelty_history.append(s)
        if len(self.state.novelty_history) > self.cfg.novelty_window:
            self.state.novelty_history = self.state.novelty_history[
                -self.cfg.novelty_window :
            ]
        return s * scale

    def _build_output(self, t: float) -> dict:
        return {
            "E": [round(e, 4) for e in self.state.E],
            "bond": round(self.composite_bond(), 4),
            "mode": self.relational_mode(t).value,
            "hint": self.prompt_hint(t),
        }


# ─── Convenience ────────────────────────────────────────────────────

def load_config(path: str) -> ADFConfig:
    with open(path) as f:
        return ADFConfig.from_dict(json.load(f))

def load_state(path: str, n_dims: int) -> ADFState:
    with open(path) as f:
        return ADFState.from_dict(json.load(f), n_dims)

def save_state(state: ADFState, path: str) -> None:
    with open(path, "w") as f:
        json.dump(state.to_dict(), f, separators=(",", ":"))
```

### 12.1. Usage Example

```python
from adf import ADFConfig, ADFEngine

config = ADFConfig(
    baseline=[0.45, 0.55, 0.50, 0.20, 0.25],
    capacity=[1.0, 1.0, 1.0, 1.0, 1.0],
    beta=[0.10, 0.12, 0.15, 0.05, 0.08],
    lam=[0.005, 0.015, 0.050, 0.002, 0.030],
    tau_hours=[168, 48, 4, 720, 24],
    sigma=[0.02, 0.03, 0.05, 0.01, 0.02],
    tanh_scale=[12.0, 4.0, 1.0, 25.0, 3.0],
    kappa=[
        [0.00, 0.02, 0.00, 0.01, 0.00],
        [0.03, 0.00, 0.01, 0.01, 0.02],
        [0.01, 0.02, 0.00, 0.00, 0.00],
        [0.00, 0.00, 0.00, 0.00, 0.00],
        [0.00, 0.03, 0.00, 0.00, 0.00],
    ],
    noise_seed=42,  # deterministic for this example
)

engine = ADFEngine(config)

# Simulate a warm first interaction
result = engine.process_interaction([0.6, 0.7, 0.5, 0.3, 0.2])
print(result["hint"])
# → [ADF bond=0.46 mode=new | tone=conversational, humor=permitted]

# After several positive interactions...
for _ in range(10):
    engine.process_interaction([0.4, 0.5, 0.3, 0.2, 0.1])

result = engine.process_interaction([0.3, 0.4, 0.2, 0.1, 0.1])
print(result["hint"])
# → E values will have risen, mode likely "building"

# Simulate a trust violation
result = engine.process_interaction([-0.8, -0.5, -0.3, 0.0, -0.4])
print(result["hint"])
# → trust drops sharply (hysteresis), coupling drags warmth/energy down

# Simulate a low-confidence ambiguous message
result = engine.process_interaction([0.1, 0.0, 0.1, 0.0, 0.0], confidence=0.3)
print(result["hint"])
# → minimal state change due to low confidence attenuation
```

---

## 13. Conclusion

The Affective Dynamics Framework extends Roemmele's Love Equation from a civilizational alignment metric into a practical personality engine for AI agents. The core contributions are:

1. **Bounded dynamics** via logistic growth, preventing runaway emotional states
2. **Historical memory** through exponential-decay convolution, making the agent's emotional response path-dependent
3. **Multi-dimensional affect** decomposing the scalar `E` into distinct emotional channels with inter-dimensional coupling
4. **Personality encoding** via configurable baseline vectors with familiarity-scaled regression dynamics
5. **Behavioral coupling** mapping emotional state to concrete LLM behavioral parameters
6. **Phase transitions** via bifurcation triggers that produce qualitatively different relational postures at threshold crossings
7. **Modular extensions** for attachment style, emotional momentum, trust hysteresis, novelty/habituation, relational context classification, bifurcation triggers, and mood-congruent processing

The framework is designed to be context-window-efficient (125-400 tokens depending on configuration), file-based (compatible with SOUL.md and the broader Soul Spec ecosystem), and computationally trivial (all operations are O(1) per interaction per dimension).

ADF does not claim to simulate consciousness, nor does it position itself as a solution to the alignment problem. It is a tool for producing *behaviorally plausible* emotional dynamics in agents that interact with humans over time — a system for modeling relational inertia rather than simulating subjective experience. The intent is to make those interactions feel less mechanical and more relationally coherent: to give agents the capacity to remember, to warm up, to cool down, to be surprised, to hold grudges and grant forgiveness, and to carry the weight of shared history into every exchange.

---

## 14. References

1. Roemmele, B. (1978). *The Math Behind Extraterrestrial Emotions: A Case for Love and Humor.* Unpublished manuscript.

2. Roemmele, B. (2025). "The Love Equation: A Universal Mathematical Framework for Intelligence Alignment, Cosmic Survival, and the Resolution of the AI Alignment Problem." *Read Multiplex.*

3. Cyber Strategy Institute. (2026). "Brian Roemmele's Love Equation Alignment for AI SAFE²: How to Make OpenClaw and AI Personal Assistants Actually Love Humans."

4. Anderson, D. (2026). "OpenClaw and the Programmable Soul." *Medium.*

5. Bartholomew, K., & Horowitz, L. M. (1991). "Attachment Styles Among Young Adults: A Test of a Four-Category Model." *Journal of Personality and Social Psychology*, 61(2), 226-244.

6. Liu, X. "The First Paradigm of Consciousness Uploading: Mechanisms of Consciousness Evolution in the AI Axial Age and a Prospect toward Web4." Referenced via the soul.md project (github.com/aaronjmars/soul.md).

7. Steinberger, P. OpenClaw SOUL.md Template. docs.openclaw.ai/reference/templates/SOUL

---

*This document is released under the MIT License. Derivative works are encouraged.*  
*For questions, contributions, or errata: h8rt3rmin8r@gmail.com*
