CREATE TABLE users (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE panels (
    email TEXT NOT NULL,
    panel_id TEXT NOT NULL,
    normal_image BLOB NOT NULL,
    thermal_image BLOB NOT NULL,
    severity TEXT,
    recommended_action TEXT,
    next_maintenance TEXT,
    PRIMARY KEY (email, panel_id),
    FOREIGN KEY (email) REFERENCES users(email)
);
