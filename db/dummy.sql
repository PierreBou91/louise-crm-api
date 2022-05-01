-- SELECT p.id, p.first_name, p.last_name, p.email, p.password_hash, ARRAY(SELECT ph.phone_number FROM phones as ph WHERE ph.id = ANY(p.phone_id_list)) AS phones, p.is_user, p.owner_id, t.label AS team, o.org_name AS organisation, r.label AS role, p.is_admin, p.created_at, p.created_by, p.is_deleted FROM persons AS p LEFT JOIN teams AS t ON t.id = p.team_id LEFT JOIN organisations AS o ON o.id = p.org_id LEFT JOIN roles AS r ON r.id = p.role_id;

INSERT INTO persons (
    id,
    first_name,
    last_name,
    email,
    password_hash,
    phone_number,
    is_user,
    comment_id_list,
    action_id_list,
    owner_id,
    team_id,
    org_id,
    role_id,
    is_admin,
    created_by
) VALUES
('39ddb6e3-af27-4254-86a2-576b75d43f6b','Pierre','Bourbour','pierre@email.com','ajkshw7q7w','0639485700',true,NULL,NULL,'7eced6a2-fa47-4003-a073-36161fe66683','7a8bc9c9-3f30-4949-aa33-f90007aefabc','39d15fb3-7418-4a31-a143-60a5e0d34b8c','ce10636d-aff5-4aa0-8b83-25f8da4fdb62',true,'39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('7eced6a2-fa47-4003-a073-36161fe66683','Chacha','Boulboul','chacha@email.com','qwdcs333az','0639485701',false,NULL,NULL,'baa9c066-68ce-4552-bd42-2e6fd6aebdb7','67cdac94-22ab-4a66-85ec-701bfd5876d5','e2473c5a-4836-417f-aa8c-4e9a370a12a8','5252adbc-458b-46cc-a41b-1284d0797215',false,'39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('baa9c066-68ce-4552-bd42-2e6fd6aebdb7','Louise','Bourbour','louise@email.com','wipskcj34f','0639485702',true,'{9f2d5d9c-b748-4933-8426-9706c5dbb3d7,ab918869-c65b-4a07-862c-14e17c767f97}','{3c8b3e57-b3a0-4df5-b193-364700ebfecd,97596a51-e9f4-4788-9a58-59faa378da3c}','39ddb6e3-af27-4254-86a2-576b75d43f6b','1de4e23b-158b-4245-ac93-ca109da6e291','39d15fb3-7418-4a31-a143-60a5e0d34b8c','1ecf6bf0-1fed-4bb4-aac0-c437b945cb05',false,'39ddb6e3-af27-4254-86a2-576b75d43f6b');

INSERT INTO organisations (
    id,
    org_name,
    is_client,
    owner_id,
    created_by
) VALUES
('39d15fb3-7418-4a31-a143-60a5e0d34b8c','CRM-Louiz',false,'39ddb6e3-af27-4254-86a2-576b75d43f6b','39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('e2473c5a-4836-417f-aa8c-4e9a370a12a8','Cabinet Chacha',true,'39ddb6e3-af27-4254-86a2-576b75d43f6b','baa9c066-68ce-4552-bd42-2e6fd6aebdb7');

INSERT INTO teams (
    id,
    label,
    owner_org_id,
    created_by
) VALUES
('67cdac94-22ab-4a66-85ec-701bfd5876d5','Team des avocats','e2473c5a-4836-417f-aa8c-4e9a370a12a8','baa9c066-68ce-4552-bd42-2e6fd6aebdb7'),
('1de4e23b-158b-4245-ac93-ca109da6e291','Commerce','39d15fb3-7418-4a31-a143-60a5e0d34b8c','39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('7a8bc9c9-3f30-4949-aa33-f90007aefabc','IT','39d15fb3-7418-4a31-a143-60a5e0d34b8c','39ddb6e3-af27-4254-86a2-576b75d43f6b');

INSERT INTO actions (
    id,
    label,
    target_date,
    is_done,
    contact_id,
    created_by
) VALUES
('3c8b3e57-b3a0-4df5-b193-364700ebfecd','Une action 1','2012-08-24 14:00:00 +02:00',false,'7eced6a2-fa47-4003-a073-36161fe66683','baa9c066-68ce-4552-bd42-2e6fd6aebdb7'),
('97596a51-e9f4-4788-9a58-59faa378da3c','Une action 2','2012-08-24 14:00:00 +02:00',false,'39ddb6e3-af27-4254-86a2-576b75d43f6b','baa9c066-68ce-4552-bd42-2e6fd6aebdb7');

INSERT INTO roles (
    id,
    label,
    team_id,
    created_by
) VALUES
('1ecf6bf0-1fed-4bb4-aac0-c437b945cb05','Commerciale','1de4e23b-158b-4245-ac93-ca109da6e291','39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('ce10636d-aff5-4aa0-8b83-25f8da4fdb62','Admin','7a8bc9c9-3f30-4949-aa33-f90007aefabc','baa9c066-68ce-4552-bd42-2e6fd6aebdb7'),
('5252adbc-458b-46cc-a41b-1284d0797215','Avocate','67cdac94-22ab-4a66-85ec-701bfd5876d5','baa9c066-68ce-4552-bd42-2e6fd6aebdb7');

INSERT INTO comments (
    id,
    content,
    created_by
) VALUES
('9f2d5d9c-b748-4933-8426-9706c5dbb3d7','Beautiful and nice','39ddb6e3-af27-4254-86a2-576b75d43f6b'),
('ab918869-c65b-4a07-862c-14e17c767f97','Nice and pretty','39ddb6e3-af27-4254-86a2-576b75d43f6b')