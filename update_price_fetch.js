const supabaseUrl = 'https://kvbbiylhxfwqevsvpktj.supabase.co';
const supabaseKey = 'sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx';

async function updateData() {
    console.log("Updating buy order price to 1450...");
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/orders?order_type=eq.buy`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ price: 1450 })
        });
        
        if (!response.ok) {
            console.error("Error updating:", await response.text());
        } else {
            console.log("Update success!");
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

updateData();
