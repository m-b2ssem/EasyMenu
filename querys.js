export function selectEmailColumn(db, callback) {
    db.query("SELECT email FROM users", (e, res) => {
        if (e) {
            callback(e, null);
        } else {
            callback(null, res.rows);
        }
    });
}

export function checkIfUserExist(db, email, callback) {
    db.query("SELECT email FROM users WHERE email = $1",
        [email], (e, res) => {
            if (e || res.rowCount === 0) {
                callback(false);
            } else {
                callback(true);
            }
        }
    );
}
