-- Run after schema.sql. Safe to run again: it updates matching IDs.
insert into public.courts (id,name,area,types,court_count,price_range,booking_method,link,facebook_link,note,last_verified) values
('pickleballers-space','Pickleballers Space','Tagum City',array['outdoor'],0,'₱200–250/hr','custom_site','https://pickleballers.space/',null,'Online calendar and GCash booking. Court count still needs venue confirmation.','2026-07-28'),
('paddle-yard-tagum','Paddle Yard Tagum','Magugpo North',array['outdoor'],0,null,'custom_site','https://paddleyardtagum.com/','https://www.facebook.com/paddleyardtgm','Purok A, Suaybaguio District. Reserve in advance through the official site.','2026-07-28'),
('hideout-pickleball-court','Hideout Pickleball Court','Mankilam',array['indoor'],0,null,'custom_site','https://hideouttagum.club/',null,'Book through the venue’s own reservation page; open-play announcements appear there too.','2026-07-28'),
('the-lob','The LOB','Magugpo West',array['outdoor'],4,null,'pickle_hub','https://picklehub.ph/the-lob?tab=home',null,'Four courts in a converted motorpool. Booking is handled by PickleHub.','2026-07-28'),
('the-rally-point','The Rally Point','Tagum City',array['indoor'],0,null,'pickle_hub','https://picklehub.ph/the-rally-point?tab=home',null,'A central Tagum venue with an on-site café. Check its PickleHub page for the current booking route.','2026-07-28'),
('happy-paddle','Happy Paddle','San Miguel',array['outdoor'],0,null,'custom_site','https://kudoscourts.ph/venues/happy-paddle-2',null,'Prk. 3, Durian West. View availability and contact details through KudosCourts.','2026-07-28'),
('the-palm-court','The Palm Court','Mankilam',array['outdoor'],0,null,'phone','tel:+639177102077',null,'Purok Caimito. Call the venue directly to ask about a court and booking times.','2026-07-28'),
('pickle-city','Pickle City','Tagum City',array['outdoor'],0,null,'phone','tel:+639217360396',null,'Call to confirm the current drop-in rate, availability, and booking policy.','2026-07-28')
on conflict (id) do update set
  name=excluded.name, area=excluded.area, types=excluded.types, court_count=excluded.court_count,
  price_range=excluded.price_range, booking_method=excluded.booking_method, link=excluded.link,
  facebook_link=excluded.facebook_link, note=excluded.note, last_verified=excluded.last_verified,
  updated_at=now();
