# Justin Jake Jenna Blaine hackMIT 2021

"""
Use this to start the Flask app.

-> python3 main.py
"""


from api import create_app

# Creates app from api package:
app = create_app()


# Runs the Flask app with debugging.
# ( localhost:5000 )
def _main():
    app.run(debug=True)


# Run the script directly:
if __name__ == '__main__':
    _main()
    print('flask app ended')
