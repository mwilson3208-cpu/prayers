# Admin Guide

A short guide for whoever reviews prayers each day. Plan on five to ten minutes.

## Signing in

1. Go to `yoursite.com/admin`.
2. Enter the admin password (the `ADMIN_PASSWORD` you set in Vercel).
3. You stay signed in for 12 hours on that device. Tap **Sign out** when you are done on a shared computer.

Forgot the password? In Vercel, open the project, go to **Settings** then **Environment Variables**, change `ADMIN_PASSWORD`, and redeploy.

## The four tabs

A gold number on a tab means something is waiting for you.

**Prayers.** Filters across the top:
- **Pending**: new public requests waiting for review, oldest first.
- **Approved**: live on the prayer wall.
- **Hidden**: removed from the wall but kept.
- **Private**: requests the person asked to keep private. These are never shown publicly, no matter what. Read them and pray.

**Testimonies.** Answered prayers, with the same Pending, Approved, and Hidden filters.

**Messages.** Notes from the contact form on the About page. Tap **Reply by email** to answer in your email app.

**Subscribers.** People who signed up for the 7-Day Prayer Guide. Tap **Download as CSV** for the full list.

## The buttons

| Button | What it does |
| --- | --- |
| **Approve** | Publishes the item. It appears on the site within a minute. |
| **Hide** | Takes it off the site but keeps it. You can bring it back later. |
| **Back to pending** | Moves a hidden item back to the review queue. |
| **Edit** | Opens the text so you can fix it. Tap **Save changes**. |
| **Delete** | Removes it forever. You will be asked to confirm. |
| **View** | Opens the public page for an approved request. |

## What to look for before approving

Approve when the request is sincere and safe to show. Before approving, use **Edit** to remove:

- Last names, phone numbers, addresses, email addresses, workplaces, or anything that identifies a specific person.
- Details about someone else that they might not want public (for example, a named person's diagnosis).

Hide or delete when the item is spam, mocking, hateful, sexual, or selling something.

## Flags

Some items arrive with a colored label.

- **Urgent: Possible crisis.** The person may be thinking about self-harm or may be in danger. They were already shown the 988 Suicide and Crisis Lifeline. Pray for them right away. If they left an email (shown under the request, visible only to you), consider sending a short, caring note that encourages them to call or text 988, or 911 if they are in danger. Do not approve crisis requests to the public wall without editing out anything that identifies them.
- **Profanity masked.** Rude words were replaced with asterisks automatically. Read it in context. Often it is someone in pain, not someone being hostile.
- **Contains contact details.** The text includes an email or phone number. Edit it out before approving.

Uncheck **Keep flagged** in the Edit panel once you have dealt with it.

## Emails you will receive

If `ADMIN_EMAIL` is set, you get an email for each new public request, private request, testimony, and contact message. Urgent items say **[Urgent]** in the subject line. To stop these emails, set `ADMIN_ALERTS` to `off` in Vercel and redeploy.

## Common questions

**Someone asked us to remove their request.** Find it under Approved and tap Delete.

**A request is old and the person never came back.** Leave it. People keep praying for it. You can hide very old ones if the wall feels stale.

**Can I post a prayer myself?** Yes. Submit it on the site like anyone else, then approve it.

**Sample prayers from setup are still showing.** They are the 12 sample prayers and 5 testimonies from `seed.sql`. Delete them from the Approved tabs whenever you like.

**The counters on the home page look behind.** They refresh about once a minute.
