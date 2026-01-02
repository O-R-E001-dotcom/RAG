# Imports
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import Literal
from duckduckgo_search import DDGS
import os

# Load API key
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found! Please set it in your .env file.")

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,  # Lower temperature for more precise tool usage
    api_key=openai_api_key
)

@tool
def get_weather(city: str) -> str:
    """
    Return simulated weather information for a given city.
    Use this tool when the user asks about weather conditions.
    
    Args:
        city: Name of the city (e.g. "Lagos", "London")
        
    Returns:
        A string describing the weather in the city
        
    Examples:
        - "Lagos" returns "🌦️ Lagos is currently 28°C with scattered clouds."
        - "London" returns "🌧️ London is currently 15°C with light rain."
    """
    try:
        weather_data = {
            "lagos": "🌦️ Lagos is currently 28°C with scattered clouds.",
            "london": "🌧️ London is currently 15°C with light rain.",
            "new york": "☀️ New York is currently 22°C and sunny."
        }

        return weather_data.get(
            city.lower(),
            f"I don't have weather data for {city}."
        )
    except Exception as e:
        return f"Error getting weather: {str(e)}"

print("✅ Weather tool created")

@tool
def define_word(word: str) -> str:
    """
    Look up the definition of a word using a small built-in dictionary.
    Use this tool when the user asks for word meanings.
    
    Args:
        word: The word to define (e.g. "ephemeral")
        
    Returns:
        The definition of the word as a string
        
    Examples:
        - "ephemeral" returns "Lasting for a very short time."
        - "resilient" returns "Able to recover quickly from difficulties."
    """
    try:
        dictionary = {
            "ephemeral": "Lasting for a very short time.",
            "resilient": "Able to recover quickly from difficulties.",
            "innovation": "The act of introducing something new."
        }

        return dictionary.get(
            word.lower(),
            f"No definition found for '{word}'."
        )
    except Exception as e:
        return f"Error defining word: {str(e)}"

print("✅ Dictionary tool created")

@tool
def web_search(query: str) -> str:
    """
    Search the web using DuckDuckGo and return top results.
    Use this tool when the user asks for recent or external information.
    
    Args:
        query: The search query (e.g. "latest AI news")
        
    Returns:
        A formatted string of search results
        
    Examples:
        - "latest AI news" returns recent AI-related articles
        - "LangChain tutorials" returns learning resources
    """
    try:
        results = []

        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=3):
                results.append(f"- {r['title']}: {r['href']}")

        if not results:
            return "No relevant results found."

        return "\n".join(results)

    except Exception as e:
        return f"Error during web search: {str(e)}"

print("✅ Web search tool created")

# Create a list of tools
tools = [get_weather, define_word, web_search]

# Bind tools to the LLM
llm_with_tools = llm.bind_tools(tools)

print(f"✅ LLM bound to {len(tools)} tools")
print(f"   Tools: {[tool.name for tool in tools]}")

# System prompt that encourages tool usage
sys_msg = SystemMessage(content="""You are a helpful assistant with access to tools.

When asked to check weather, use the get_weather tool.
When asked to define a word, use the define_word tool.
When asked for recent information, use the web_search tool.

Only use tools when necessary - for simple questions, answer directly.""")

def assistant(state: MessagesState) -> dict:
    """
    Assistant node - decides whether to use tools or answer directly.
    """
    messages = [sys_msg] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

print("✅ Assistant node defined")

def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    """
    Decide next step based on last message.
    
    If LLM called a tool → go to 'tools' node
    If LLM provided final answer → go to END
    """
    last_message = state["messages"][-1]
    
    # Check if LLM made tool calls
    if last_message.tool_calls:
        return "tools"
    
    # No tool calls - we're done
    return "__end__"

print("✅ Conditional routing function defined")

# Create the graph
builder = StateGraph(MessagesState)

# Add nodes
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))  # ToolNode executes tool calls automatically

# Define edges
builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    should_continue,
    {"tools": "tools", "__end__": END}
)
builder.add_edge("tools", "assistant")  # After tools, go back to assistant

# Add memory
memory = MemorySaver()
agent = builder.compile(checkpointer=memory)

print("✅ Agent graph compiled with tools and memory")

# Helper function
def run_agent(user_input: str, thread_id: str = "test_session"):
    """
    Run the agent and display the conversation.
    """
    print(f"\n{'='*70}")
    print(f"👤 User: {user_input}")
    print(f"{'='*70}\n")
    
    result = agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    
    for message in result["messages"]:
        if isinstance(message, HumanMessage):
            continue  # Already printed
        elif isinstance(message, AIMessage):
            if message.tool_calls:
                print(f"🤖 Agent: [Calling tool: {message.tool_calls[0]['name']}]")
            else:
                print(f"🤖 Agent: {message.content}")
        elif isinstance(message, ToolMessage):
            print(f"🔧 Tool Result: {message.content[:100]}..." if len(message.content) > 100 else f"🔧 Tool Result: {message.content}")
    
    print(f"\n{'='*70}\n")

print("✅ Test function ready")

run_agent("What's the weather like in Lagos today?")
run_agent("Define the word 'ephemeral'.")   
run_agent("What's the latest news on AI advancements?")
run_agent("Hello, good morning!")
