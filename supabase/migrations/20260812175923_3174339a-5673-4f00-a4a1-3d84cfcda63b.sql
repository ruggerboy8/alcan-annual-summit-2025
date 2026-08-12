UPDATE public.email_templates
SET html = replace(
  html,
  '          <!-- FOOTER -->',
  $blk$          <!-- HOTEL -->
          <tr>
            <td align="center" style="padding:0 0 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF;">
                <tr>
                  <td style="padding:36px 40px;color:#1A2330;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;">
                    <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C49A3C;margin-bottom:12px;">WHERE TO STAY</div>
                    <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#124570;font-weight:normal;margin:0 0 16px;">Fairfield Inn &amp; Suites Austin Buda</h2>
                    <p style="margin:0 0 20px;">Book your room online using our corporate promo code to receive the Alcan group rate.</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #C49A3C;border-radius:8px;">
                      <tr>
                        <td align="center" style="padding:18px 20px;">
                          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A7233;margin-bottom:6px;">PROMO CODE</div>
                          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:3px;color:#124570;">F3088</div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:20px 0 8px;font-weight:bold;">How to apply it:</p>
                    <p style="margin:0 0 6px;">1. Select your dates and number of occupants.</p>
                    <p style="margin:0 0 6px;">2. Under the <strong>Special Rate</strong> tab, choose <strong>Corp/Promo Code</strong>.</p>
                    <p style="margin:0 0 20px;">3. Enter code <strong>F3088</strong>, then choose the room you&rsquo;d like to book.</p>
                    <p style="margin:0;"><a href="https://www.marriott.com/en-us/hotels/ausbu-fairfield-inn-and-suites-austin-buda/overview/" style="color:#124570;font-weight:bold;text-decoration:underline;">Book at Fairfield Inn &amp; Suites Austin Buda &rarr;</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->$blk$
),
updated_at = now()
WHERE template_key = 'confirmation'
  AND html NOT LIKE '%F3088%';