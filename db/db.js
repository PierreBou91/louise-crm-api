const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function selectCommentsdFromPersonId(personId) {
  const query =
    "SELECT * FROM comments WHERE id = any(SELECT unnest(comment_id_list) FROM persons WHERE id = $1);";
  const value = [personId];
  const comments = await pool.query(query, value);
  return comments.rows;
}

async function selectOwnerFromPersonId(personId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT owner_id FROM persons WHERE id = $1);";
  const value = [personId];
  const owner = await pool.query(query, value);
  return owner.rows[0];
}

async function selectRoleFromPersonId(personId) {
  const query =
    "SELECT * FROM roles WHERE id = (SELECT role_id FROM persons WHERE id = $1);";
  const value = [personId];
  const role = await pool.query(query, value);
  return role.rows[0];
}

async function selectCreatedByFromCommentId(commentId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT created_by FROM comments WHERE id = $1);";
  const value = [commentId];
  const createdBy = await pool.query(query, value);
  return createdBy.rows[0];
}

async function selectOrgFromPersonId(personId) {
  const query =
    "SELECT * FROM organisations WHERE id = (SELECT org_id FROM persons WHERE id = $1);";
  const value = [personId];
  const org = await pool.query(query, value);
  return org.rows[0];
}

async function selectTeamFromPersonId(personId) {
  const query =
    "SELECT * FROM teams WHERE id = (SELECT team_id FROM persons WHERE id = $1);";
  const value = [personId];
  const team = await pool.query(query, value);
  return team.rows[0];
}

async function selectCreatedByFromPersonId(personId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT created_by FROM persons WHERE id = $1);";
  const value = [personId];
  const person = await pool.query(query, value);
  return person.rows[0];
}

async function selectOrgFromTeamId(teamId) {
  const query =
    "SELECT * FROM organisations WHERE id = (SELECT owner_org_id FROM teams WHERE id = $1);";
  const value = [teamId];
  const org = await pool.query(query, value);
  return org.rows[0];
}

async function selectCreatedByFromTeamId(teamId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT created_by FROM teams WHERE id = $1);";
  const value = [teamId];
  const org = await pool.query(query, value);
  return org.rows[0];
}

async function selectOwnerFromOrgId(orgId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT owner_id FROM organisations WHERE id = $1);";
  const value = [orgId];
  const owner = await pool.query(query, value);
  return owner.rows[0];
}

async function selectCreatedByFromOrgId(orgId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT created_by FROM organisations WHERE id = $1);";
  const value = [orgId];
  const createdBy = await pool.query(query, value);
  return createdBy.rows[0];
}

async function selectTeamFromRoleId(roleId) {
  const query =
    "SELECT * FROM roles WHERE id = (SELECT team_id FROM persons WHERE id = $1);";
  const value = [roleId];
  const team = await pool.query(query, value);
  return team.rows[0];
}

async function selectCreatedByFromRoleId(roleId) {
  const query =
    "SELECT * FROM persons WHERE id = (SELECT created_by FROM roles WHERE id = $1);";
  const value = [roleId];
  const createdBy = await pool.query(query, value);
  return createdBy.rows[0];
}

module.exports = {
  pool,
  selectCommentsdFromPersonId,
  selectOwnerFromPersonId,
  selectRoleFromPersonId,
  selectCreatedByFromCommentId,
  selectOrgFromPersonId,
  selectTeamFromPersonId,
  selectCreatedByFromPersonId,
  selectOrgFromTeamId,
  selectCreatedByFromTeamId,
  selectOwnerFromOrgId,
  selectCreatedByFromOrgId,
  selectTeamFromRoleId,
  selectCreatedByFromRoleId,
};
