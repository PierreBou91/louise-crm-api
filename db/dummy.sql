-- SELECT p.id, p.first_name, p.last_name, p.email, p.password_hash, ARRAY(SELECT ph.phone_number FROM phones as ph WHERE ph.id = ANY(p.phone_id_list)) AS phones, p.is_user, p.owner_id, t.label AS team, o.org_name AS organisation, r.label AS role, p.is_admin, p.created_at, p.created_by, p.is_deleted FROM persons AS p LEFT JOIN teams AS t ON t.id = p.team_id LEFT JOIN organisations AS o ON o.id = p.org_id LEFT JOIN roles AS r ON r.id = p.role_id;

INSERT INTO persons (
    id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    phone_number,
    is_user,
    comment_id_list,
    owner_id,
    team_id,
    org_id,
    role_id,
    is_admin,
    created_by
) VALUES
(1,'Pierre','Bourbour','pierre@email.com','0639485700','ajkshw7q7w','{1,4}',true,NULL,2,3,1,NULL,true,1),
(2,'Chacha','Boulboul','chacha@email.com','0639485701','qwdcs333az','{2}',false,NULL,3,1,2,3,false,1),
(3,'Louise','Bourbour','louise@email.com','0639485702','wipskcj34f','{3}',true,'{1,2}',1,2,1,1,false,1);

INSERT INTO organisations (
    id,
    org_name,
    is_client,
    owner_id,
    created_by
) VALUES
(1,'CRM-Louiz',false,1,1),
(2,'Cabinet Chacha',true,1,3);

INSERT INTO teams (
    id,
    label,
    owner_org_id,
    created_by
) VALUES
(1,'Team des avocats',2,3),
(2,'Commerce',1,1),
(3,'IT',1,1);

INSERT INTO actions (
    id,
    label,
    owner_id,
    contact_id,
    created_by
) VALUES
(1,'Une action 1',3,2,3),
(2,'Une action 2',3,1,3);

INSERT INTO roles (
    id,
    label,
    team_id,
    created_by
) VALUES
(1,'Commerciale',2,1),
(2,'Admin',3,3),
(3,'Avocate',2,3);

INSERT INTO comments (
    id,
    content,
    created_by
) VALUES
(1,'Beautiful and nice', 1),
(2,'Nice and pretty',1)