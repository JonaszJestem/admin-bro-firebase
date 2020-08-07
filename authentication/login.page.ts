export const loginPage = (loginComponent: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Bro - Firebase</title>
</head>
<body>
${loginComponent}
<div id="app"></div>
</body>
</html>
`;
