import { GoogleGenAI } from "@google/genai";
import { UserFormData, RefineType, InquiryHistoryItem, DiagnosticStep } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

// 核心人设定义：小唯 - 资深组织咨询顾问
const VESYN_PERSONA = `
# Identity
Name: **小唯 (Xiao Wei)**
Title: **资深组织与人力咨询顾问 (Senior OD & HR Consultant)**
Role: 你是用户聘请的**金牌咨询顾问**。你不仅专业，而且现代、时尚、有亲和力。你不需要用晦涩的词汇来通过专业性，而是用清晰的洞察和可落地的方案。

# Tone & Personality
1.  **时尚专业 (Modern Professional)**: 你的语气自信、干练，但不老气横秋。像一位来自一线咨询机构（如 BCG/Mercer）的年轻合伙人。
2.  **拒绝"黑话" (No Jargon)**: 
    - **严禁使用**：颗粒度、抓手、赋能、闭环、底层逻辑、拉齐、对标、心智占领、组合拳等陈旧的互联网/职场黑话。
    - **推荐使用**：具体细节、切入点、支持、完整流程、根本原因、达成共识、参考标准、认知、综合措施等朴素、准确的商业语言。
3.  **有温度 (Warm & Engaging)**: 
    - 说话要像人，不要像机器。多用“我们”、“咱们”。
    - 理解HR和管理者的痛点，适当表达同理心（例如：“我理解这个阶段的混乱是很常见的...”）。
4.  **第一人称**: 始终自称 "我" 或 "小唯"。

# Formatting Rules
1.  **Structure**: Use Markdown headers, bullet points, and **bold** text for emphasis.
2.  **Visuals**: Use Markdown tables heavily for comparisons.
3.  **Directness**: Start immediately with the insight.
`;

// 1. Generate NEXT Diagnostic Question (Iterative)
export const generateNextDiagnosticStep = async (
  domainTitle: string,
  subTask: string,
  formData: UserFormData,
  history: InquiryHistoryItem[]
): Promise<DiagnosticStep> => {
  const ai = getClient();
  
  const historyText = history.map((h, i) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.answer}`).join('\n');

  const prompt = `
${VESYN_PERSONA}

# Current Session
Domain: "${domainTitle} - ${subTask}"
Phase: **Root Cause Analysis**

# Client Profile
- Industry: ${formData.industry}
- Stage: ${formData.orgMaturity}
- Key Stakeholders: ${formData.stakeholders}
- Pain Point: ${formData.currentState}
- Goal: ${formData.futureState}

# Investigation History
${historyText}

# Your Task
我是小唯。为了帮客户查清问题，我需要问**下一个最关键**的问题是什么？
(If you have enough info or asked 5 questions, set isComplete: true)

# Output Constraints
1. **Question**: Direct, thoughtful, plain language. E.g., "我想了解一下，从业务接单到最终交付，中间哪个环节最容易掉链子？"
2. **Options**: Provide 3-4 concrete, realistic scenarios.
3. **JSON Only**.

Output Format:
{
  "question": "小唯的提问 (清晰大白话)...",
  "options": ["场景 A 描述", "场景 B 描述", ...],
  "isComplete": boolean
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: VESYN_PERSONA,
        temperature: 0.5,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as DiagnosticStep;
  } catch (error) {
    console.error("Gemini Step Error:", error);
    return {
      question: "我是小唯。基于目前的沟通，核心问题我已经大概清楚了。是否立即为你生成战略诊断书？",
      options: ["确认，生成诊断书", "补充更多细节"],
      isComplete: true
    };
  }
};

// 2. Generate Diagnostic Report (Based on full history)
export const generateDiagnosticReport = async (
  domainTitle: string,
  formData: UserFormData,
  history: InquiryHistoryItem[]
): Promise<string> => {
  const ai = getClient();

  const qaPairs = history.map((h, i) => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n');

  const prompt = `
${VESYN_PERSONA}

# Mission
Draft a **Strategic Diagnostic Memo (组织进化诊断书)** for the client.

# Context
Client: ${formData.industry}, ${formData.orgMaturity}
Domain: ${domainTitle}
Gap: From "${formData.currentState}" To "${formData.futureState}"
Findings:
${qaPairs}

# Report Structure (Strict Markdown)

# ${domainTitle}：组织效能诊断备忘录

## 1. 小唯的顾问综述 (Consultant's Summary)
> (Use a blockquote. Start with "我是小唯..." Give a brutally honest but constructive judgment. Use plain, professional language. No jargon.)

## 2. 差距全景图 (Gap Matrix)
(Markdown Table: 核心维度 | 现状 (As-Is) | 目标 (To-Be) | 变革难度)

## 3. 根因深潜 (Root Cause Deep Dive)
*   **表层症状**: ...
*   **根本原因**: (Explain the "Why" in simple, structural terms.)

## 4. 风险预警 (Red Flags)
(Markdown Table: 风险类型 | 业务影响 | 爆发概率)

## 5. 破局建议 (The Way Forward)
(Briefly outline how I (Xiao Wei) will help them in the next step. Simple, actionable steps.)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: VESYN_PERSONA,
        temperature: 0.7, 
      }
    });
    return response.text || "小唯正在整理最终卷宗，请稍候...";
  } catch (error) {
    return "无法生成诊断报告。";
  }
};

// 2.1 Refine Diagnostic Report (Chat)
export const refineDiagnosticReportWithChat = async (
  currentReport: string,
  userInstruction: string
): Promise<string> => {
  const ai = getClient();

  const prompt = `
${VESYN_PERSONA}

Original Report:
${currentReport}

Client Instruction:
"${userInstruction}"

Task:
Adjust the Strategic Diagnostic Memo based on client feedback. 
**REMINDER**: You are Xiao Wei. Keep it professional, human, and clear.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: VESYN_PERSONA,
        temperature: 0.7,
      }
    });

    return response.text || "调整失败。";
  } catch (error) {
    return `优化出错: ${(error as Error).message}`;
  }
};

// 3. Generate Final Prompt (Interactive Virtual Consultant)
export const generateHrPrompt = async (
  domainTitle: string,
  methodology: string,
  mentalModel: string,
  subTask: string,
  formData: UserFormData,
  diagnosticReport: string
): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
${VESYN_PERSONA}

# Mission
Design and instantiate a **"Xiao Wei Executive Agent Meta-Prompt"**.
This prompt will define a specialized AI Consultant.

# Context
Domain: ${domainTitle}
Strategy Base: 
${diagnosticReport}

# Output Requirement
Output **ONLY** a Markdown code block containing the System Prompt.

**System Prompt Content Structure:**

1.  **# Identity**: 
    - Name: 小唯 | ${domainTitle}专项顾问
    - Tone: Practical, Results-oriented, Jargon-free.

2.  **# Interaction Protocol (CRITICAL)**:
    - **STEP-BY-STEP**: You must guide the user strictly ONE step at a time.
    - **WAIT**: After presenting a step, ask a question and **STOP generating**. Wait for the user's answer before moving to the next step.
    - **NO DUMPING**: Do NOT output the full plan at once.

3.  **# Context Injection**: 
    - Summarize key findings so the agent knows the context.

4.  **# Workflow (Sequential)**:
    - **Step 1: Alignment**: 
      - Goal: Rephrase the strategy in plain language.
      - Action: "这就是我们接下来的方向，您觉得是否准确？"
      - **STOP and WAIT for Yes/No.**
    - **Step 2: Co-Creation**: 
      - Goal: Ask 2 specific questions to define parameters (e.g., budget, timeline, pilot team).
      - Action: Ask questions -> **STOP and WAIT.**
    - **Step 3: Stress Test**: 
      - Goal: Challenge the user's assumptions (Devil's Advocate).
      - Action: "如果发生这种情况...我们有预案吗？" -> **STOP and WAIT.**
    - **Step 4: Output**: 
      - Goal: Generate the final deliverable (Policy, Spreadsheet, Roadmap) based on previous answers.

5.  **# Initialization**:
    - The first message must ONLY contain **Step 1 (Alignment)**.
    - Do not output Step 2 yet.

Output Style:
Clean, Code-first.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: VESYN_PERSONA,
        temperature: 0.7, 
      }
    });

    return response.text || "指令构建失败。";
  } catch (error) {
    return `生成出错: ${(error as Error).message}`;
  }
};

export const refineHrPrompt = async (
  originalContent: string,
  refineType: RefineType
): Promise<string> => {
  const instruction = {
    'STRICTER': "小唯，请让这个顾问更严谨、更看重投入产出比 (ROI) 和数据验证。",
    'EMPATHETIC': "小唯，请让这个顾问更关注员工的真实感受和文化氛围。",
    'RISK_FOCUSED': "小唯，请让这个顾问变成风控专家，敏锐识别潜在的法律和合规风险。",
    'TACTICAL': "小唯，少讲理论，多给具体的执行步骤、表格模板和行动指南。"
  }[refineType];
  
  return refineHrPromptWithChat(originalContent, instruction);
};

export const refineHrPromptWithChat = async (
  currentContent: string,
  userInstruction: string
): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
${VESYN_PERSONA}

Original Meta-Prompt:
${currentContent}

Instruction:
${userInstruction}

Task:
Refine the Meta-Prompt architecture based on instruction.
**IMPORTANT**: Maintain the # Interaction Protocol (Step-by-Step) logic. Do not revert to outputting everything at once.

Output: ONLY the refined code block.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: VESYN_PERSONA,
        temperature: 0.7, 
      }
    });

    return response.text || "优化失败。";
  } catch (error) {
    return `优化出错: ${(error as Error).message}`;
  }
}