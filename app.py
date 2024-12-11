import sqlite3
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

def fetch_results(search, database):
    conn = sqlite3.connect(database)
    c = conn.cursor()
    
    # Fetch words starting with the exact search keyword
    c.execute("SELECT * FROM dictionary WHERE word LIKE ?", (search + '%',))
    exact_results = [{'word': row[0], 'definition': row[1]} for row in c.fetchall()]
    
    # Fetch other words containing the search keyword
    c.execute("SELECT * FROM dictionary WHERE word LIKE ? AND word NOT LIKE ?", ('%' + search + '%', search + '%'))
    other_results = [{'word': row[0], 'definition': row[1]} for row in c.fetchall()]
    
    conn.close()
    
    return exact_results + other_results

@app.route('/')
def redirect_to_main():
    return redirect(url_for('kk_main'))

@app.route('/<path:base>/help/uriminzokkiri', methods=['GET'])
def help_uriminzokkiri(base):
    return render_template('help_uriminzokkiri.html')

@app.route('/<path:base>/help/dprktoday', methods=['GET'])
def help_dprktoday(base):
    return render_template('help_dprktoday.html')

@app.route('/<path:base>/help', methods=['GET'])
def redirect_to_help(base):
    return redirect(f'/{base}/help/uriminzokkiri')

@app.route('/KK')
def kk_main():
    return render_template('main.html', base='KK')

@app.route('/biyak')
def biyak_main():
    return render_template('main.html', base='biyak')

@app.route('/KEEK')
def keek_main():
    return render_template('main.html', base='KEEK')

@app.route('/KCCK')
def kcck_main():
    return render_template('main.html', base='KCCK')

@app.route('/KFFK')
def kffk_main():
    return render_template('main.html', base='KFFK')

@app.route('/KJJK')
def kjjk_main():
    return render_template('main.html', base='KJJK')

@app.route('/KDDK')
def kddk_main():
    return render_template('main.html', base='KDDK')

@app.route('/KRRK')
def krrk_main():
    return render_template('main.html', base='KRRK')

@app.route('/<path:base>/searchResult.do', methods=['GET', 'POST'])
def search_result(base):
    search_query = request.args.get('search', '')
    database_mapping = {
        'KK': 'KK.db',
        'biyak': 'biyak.db',
        'KEEK': 'KEEK.db',
        'KCCK': 'KCCK.db',
        'KFFK': 'KFFK.db',
        'KJJK': 'KJJK.db',
        'KDDK': 'KDDK.db',
        'KRRK': 'KRRK.db'
    }
    database = database_mapping.get(base, 'KK.db')  # Default to KK if no base is found

    results = fetch_results(search_query, database)
    return render_template('search_result.html', results=results, search=search_query, base=base)

@app.route('/<path:base>/search/suggestions')
def get_suggestions(base):
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify([])

    # Determine the database based on the current base in the URL
    database = 'KK.db' if base == 'KK' else 'biyak.db' if base == 'biyak' else 'KEEK.db' if base == 'KEEK' else 'KCCK.db' if base == 'KCCK' else 'KFFK.db' if base == 'KFFK' else 'KJJK.db' if base == 'KJJK' else 'KDDK.db' if base == 'KDDK' else 'KRRK.db'
    
    conn = sqlite3.connect(database)
    c = conn.cursor()
    c.execute("SELECT word FROM dictionary WHERE word LIKE ?", (query + '%',))
    suggestions = [{'word': row[0]} for row in c.fetchall()]
    conn.close()
    
    return jsonify(suggestions)

if __name__ == '__main__':
    app.run(debug=True)