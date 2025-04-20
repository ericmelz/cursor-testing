import streamlit as st
import json
import os

# Initialize session state for todos if it doesn't exist
if 'todos' not in st.session_state:
    st.session_state.todos = []

# Initialize settings if they don't exist
if 'settings' not in st.session_state:
    st.session_state.settings = {
        'add_button_color': '#4CAF50'  # Default green color
    }

def save_todos():
    with open('todos.json', 'w') as f:
        json.dump(st.session_state.todos, f)

def load_todos():
    if os.path.exists('todos.json'):
        with open('todos.json', 'r') as f:
            st.session_state.todos = json.load(f)

# Load todos when the app starts
load_todos()

st.title("📝 Simple Todo App!!")

# Settings section
with st.expander("⚙️ Settings"):
    st.subheader("Customize Colors")
    add_button_color = st.color_picker(
        "Add Button Color",
        value=st.session_state.settings['add_button_color'],
        key="add_button_color"
    )
    st.session_state.settings['add_button_color'] = add_button_color

# Add new todo
with st.form("add_todo_form"):
    new_todo = st.text_input("Add a new todo")
    add_button = st.form_submit_button("Add Todo")

if add_button and new_todo:
    st.session_state.todos.append({"text": new_todo, "completed": False})
    save_todos()
    st.success("Todo added successfully!")

# Display todos
st.subheader("Your Todos")
for i, todo in enumerate(st.session_state.todos):
    col1, col2 = st.columns([0.8, 0.2])
    with col1:
        st.checkbox(todo["text"], value=todo["completed"], key=f"todo_{i}")
    with col2:
        if st.button("Delete", key=f"delete_{i}"):
            st.session_state.todos.pop(i)
            save_todos()
            st.rerun()

# Add styling with dynamic colors
st.markdown(f"""
<style>
    .stButton>button {{
        color: white;
    }}
    /* Add button styling */
    div[data-testid="stFormSubmitButton"] button {{
        background-color: {st.session_state.settings['add_button_color']};
    }}
    div[data-testid="stFormSubmitButton"] button:hover {{
        background-color: {st.session_state.settings['add_button_color']};
        opacity: 0.8;
    }}
    /* Delete button styling */
    div[data-testid="stButton"] button {{
        background-color: #ff4b4b;
    }}
    div[data-testid="stButton"] button:hover {{
        background-color: #ff0000;
    }}
</style>
""", unsafe_allow_html=True) 