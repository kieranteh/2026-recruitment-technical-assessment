# Matrix <img src="https://matrix.org/images/matrix-favicon.svg" height="30" alt="Matrix Logo"/>

Matrix is an open-source platform for decentralised communication.
It is an ecosystem built through a collection of agreed-upon protocols, bots, server implementations and more.

Whilst the following task requires you to set up your own Matrix instance (homeserver), knowing Matrix is **NOT a prerequisite** for the Platforms subcommittee.
This is simply a fun (and hopefully not too painful) project to deploy that is designed to be interactive!

Your task is to send a direct message to the Matrix handle `@chino:oxn.sh` (me!) via the Matrix protocol.
However, this message must be sent from a **self-hosted instance**, such as one using the [Tuwunel](https://github.com/matrix-construct/tuwunel) implementation or the slightly more complex [Synapse](https://github.com/element-hq/synapse) implementation.

Just a simple message is enough to complete the task!
It doesn't matter if it's held together by duct tape or bolts :).

> [!IMPORTANT]
> You are free to create an account on [Matrix.org](https://matrix.org/docs/chat_basics/matrix-for-im/#creating-a-matrix-account) or other hosts for testing purposes; however, the goal of this assessment is to set up your own homeserver.
> Messages sent from a non-self-hosted server will not be accepted.

If you have sent a message but are unsure if it went through, use the [Federation Tester](https://federationtester.matrix.org/) to ensure everything is working correctly (feel free to plug in `oxn.sh` to see what a passing result looks like).
You can also ask me on Discord!
See the [FAQ](#what-do-i-do-if-i-am-stuck-confused-or-need-clarification) for details on how to get in touch.

> [!NOTE]
> I will reply to your messages, though it may take some time.
> Note that you generally won't receive a reply if your server is offline when I send it.
> Whilst most Matrix servers have retry logic, you might receive the message once the server is back online, but it may not work in all cases.

**Please write about what you tried and your process in [`report.md`](./report.md).**

This task intentionally sounds challenging and uses terminology specific to the Matrix protocol.
The aim is for you to research and make sense of various terms.
If you don't manage to get it working, we still want to hear about what you tried, what worked and what didn't; prior knowledge isn't required, but the ability to troubleshoot and figure things out is!

Good luck!

# FAQ

### What do I do if I am stuck, confused, or need clarification?

We have created a dedicated [#platform-technical-assessment](https://discord.gg/UZzqSVdSKp) channel in the [DevSoc Discord](https://discord.gg/6fnHcuFFtz).
If you have any questions, feel free to ask them there and ping @Platforms.

It may take some time for us to respond, so please be patient!
Doing your own research and demonstrating that you have put effort into your question will help us to better understand your thought process.

### This seems really open-ended. Where do I even start?

The technical assessment is intentionally open-ended and has few restrictions.
We want to see what you know and, more importantly, your ability to research and learn!

Going bare metal, using containers or even going serverless are all valid options.
However, we believe using containers (with something like Docker Compose) is the easiest path and the most relevant to Platforms.

### I don't have a domain. Does this mean I can't do the assessment?

Yes, you will need a domain name for this assessment.
However, there are plenty of affordable options available.
You can purchase a `.xyz` domain for around $3 for the first year from [Namecheap](https://www.namecheap.com/) or similar registrars.
These registrars usually offer DNS services, though [Cloudflare DNS](https://www.cloudflare.com/en-au/application-services/products/dns/) is a great alternative.

### I don't have access to my router or can't port-forward. Does this mean I can't do the assessment?

If you cannot port-forward at home, you can use [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) (which is free!) or other tunneling services to expose your instance.
Note that Cloudflare Tunnel cannot expose port 8448; we suggest looking into **Matrix Delegation** to resolve this.

It may take extra effort, but writing about this process in your report is an excellent way to demonstrate your problem-solving skills!

### Do I need to host a client?

No, you don't need to host a client yourself.
You can use the [Element Web](https://element.io/get-started) client or any other existing client.
Hosting your own client is perfectly fine and can be a fun additional challenge if you're up for it!

### How detailed should my report be?

It doesn't need to be an exhaustive manual, but please describe the problems you faced and how you solved (or worked around) them.
We will dive deeper into the details during the interview.

### I gave the assessment a go, but for the life of me, I cannot get it working. Does this mean I won't get an interview?

Not at all.
If you outline the steps you took, the problems you faced and the solutions you attempted, you do not need a fully functional solution to get an interview.
What we are considering most here is your problem-solving ability and effort, not just technical knowledge.
