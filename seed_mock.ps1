$url = "https://kvbbiylhxfwqevsvpktj.supabase.co/rest/v1/orders"
$headers = @{
    "apikey" = "sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx"
    "Authorization" = "Bearer sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

$orders = @(
    @{
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        user_id = "27c74d9d-aa68-4a59-8198-1af80c50a426"
        currency = "THB"
        order_type = "Sell"
        product = "แกลบ"
        product_name = "แกลบ"
        quantity = 500
        unit = "MT"
        price = 1500.00
        marketplace = "DAP"
        province = "นครสวรรค์"
        status = "Open"
    },
    @{
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        user_id = "27c74d9d-aa68-4a59-8198-1af80c50a426"
        currency = "THB"
        order_type = "Buy"
        product = "แกลบ"
        product_name = "แกลบ"
        quantity = 300
        unit = "MT"
        price = 1450.00
        marketplace = "DAP"
        province = "อยุธยา"
        status = "Open"
    },
    @{
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        user_id = "27c74d9d-aa68-4a59-8198-1af80c50a426"
        currency = "THB"
        order_type = "Sell"
        product = "ซังข้าวโพด"
        product_name = "ซังข้าวโพด"
        quantity = 200
        unit = "MT"
        price = 1800.00
        marketplace = "FOB"
        province = "ลพบุรี"
        status = "Open"
    },
    @{
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        user_id = "27c74d9d-aa68-4a59-8198-1af80c50a426"
        currency = "THB"
        order_type = "Buy"
        product = "มันสำปะหลัง"
        product_name = "มันสำปะหลัง"
        quantity = 1000
        unit = "MT"
        price = 2200.00
        marketplace = "DAP"
        province = "ชลบุรี"
        status = "Open"
    },
    @{
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        user_id = "27c74d9d-aa68-4a59-8198-1af80c50a426"
        currency = "THB"
        order_type = "Sell"
        product = "ทะลายปาล์ม"
        product_name = "ทะลายปาล์ม"
        quantity = 800
        unit = "MT"
        price = 1200.00
        marketplace = "CIF"
        province = "สุราษฎร์ธานี"
        status = "Open"
    }
)

foreach ($order in $orders) {
    $json = $order | ConvertTo-Json
    Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $json
}
Write-Output "Mock data inserted successfully."
