

async function run() {
    const supabaseUrl = 'https://kvbbiylhxfwqevsvpktj.supabase.co';
    const supabaseKey = 'sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx';

    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'test_biomassx_123@example.com',
            password: 'Password123!',
            data: {
                firstname: 'Test',
                lastname: 'User',
                consumer_segment: ''
            }
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

run();
