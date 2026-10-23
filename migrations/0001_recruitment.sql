CREATE TABLE IF NOT EXISTS recruitment_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  college TEXT NOT NULL,
  major_class TEXT NOT NULL,
  qq TEXT NOT NULL,
  wechat TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  primary_choice TEXT NOT NULL,
  willing_transfer INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL,
  honors TEXT NOT NULL,
  roles TEXT NOT NULL,
  technical_basis TEXT NOT NULL,
  projects TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'new',
  admin_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recruitment_applications_status ON recruitment_applications(status);
CREATE INDEX IF NOT EXISTS idx_recruitment_applications_created_at ON recruitment_applications(created_at DESC);
