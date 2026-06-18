const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kvbbiylhxfwqevsvpktj.supabase.co';
const supabaseKey = 'sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateData() {
    console.log("Updating buy order price to 1450...");
    const { data, error } = await supabase
        .from('orders')
        .update({ price: 1450 })
        .eq('order_type', 'buy');
        
    if (error) {
        console.error("Error updating:", error);
    } else {
        console.log("Update success!");
    }
}

updateData();
