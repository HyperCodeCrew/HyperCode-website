from flask import Flask

app = Flask(__name__)

def make_html(text):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Flask Page</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f9f9f9;
                color: #333;
            }}
        </style>
    </head>
    <body>
        <h1>Hello from Flask</h1>
        <p>{text}</p>
    </body>
    </html>
    """

@app.route("/api/python")
def hello_world():
    return make_html("This HTML was generated by Flask!")
