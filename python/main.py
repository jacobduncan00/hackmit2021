# Justin Jake Jenna Blaine hackMIT 2021

from api import create_app

app = create_app()


def _main():
    app.run(debug=True)


if __name__ == '__main__':
    _main()
    print('flask app ended')
