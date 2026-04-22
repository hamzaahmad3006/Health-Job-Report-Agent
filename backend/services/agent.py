from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from services.llm import get_llm
from schemas.report import JobReport
import json

class AgentState(TypedDict):
    transcript: str
    report: JobReport
    error: str

def extraction_node(state: AgentState):
    llm = get_llm()
    structured_llm = llm.with_structured_output(JobReport)
    
    system_prompt = (
        "You are an expert at converting unstructured field technician voice transcripts "
        "into structured job reports. Extract the client name, parts used, sentiment, "
        "and next actions accurately."
    )
    
    try:
        report = structured_llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Transcript: {state['transcript']}")
        ])
        return {"report": report}
    except Exception as e:
        return {"error": str(e)}

def create_agent():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("extract", extraction_node)
    
    workflow.set_entry_point("extract")
    workflow.add_edge("extract", END)
    
    return workflow.compile()

agent_executor = create_agent()

def process_transcript(transcript: str):
    initial_state = {"transcript": transcript, "report": None, "error": None}
    final_state = agent_executor.invoke(initial_state)
    return final_state
