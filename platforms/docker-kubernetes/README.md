# Docker & Kubernetes <img src="https://www.docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-180x180.png" height="30" alt="Docker Logo"/> <img src="https://raw.githubusercontent.com/cncf/artwork/refs/heads/main/projects/kubernetes/icon/color/kubernetes-icon-color.svg" height="30" alt="Kubernetes Logo"/>

## Dockerfile

You are provided with a simple Node.js API server that returns scraped UNSW academic calendar dates.
Your task is to write a Dockerfile to containerise this application.
Whilst there are no strict constraints, please adhere to best practices, as we will discuss your design choices during the interview.

If you choose to optimise for a specific goal—such as minimising image size or reducing cold-start times—please note your objective in a code comment or in [`report.md`](./report.md).
Otherwise, a standard, well-structured, general-purpose Dockerfile is perfectly acceptable.

The source code is located in the [`unsw-calendar-api/`](./unsw-calendar-api) subdirectory.
Please place your Dockerfile in the root of that directory.
You may add to or modify the existing files other than the `src/` directory, but you should have a clear reason to do so.

> [!NOTE]
> You are welcome to fork the [devsoc-unsw/academic-calendar-api](https://github.com/devsoc-unsw/academic-calendar-api) repository and push your changes to your fork.
> If you do so, please add a link to your fork in [`report.md`](./report.md).

## Kubernetes

Kubernetes is an orchestration tool that manages the networking, deployment and health of applications.
It is the backbone of DevSoc's infrastructure, ensuring our projects run reliably.
For this task, we would like you to deploy a popular open-source project: [Outline](https://www.getoutline.com/).

The most straightforward approach is to use [minikube](https://minikube.sigs.k8s.io).
By referring to the handbook and familiarising yourself with Kubernetes resources, you will be able to complete this task.
We recommend starting by translating the provided [Docker Compose](https://docs.getoutline.com/s/hosting/doc/docker-7pfeLP5a8t#h-docker-compose) file into manifests and applying them locally.
Please place your Kubernetes configuration files in the [`outline/`](./outline) directory and refer to them in your report.

Please document your process in [`report.md`](./report.md).
Specifically, we are interested in:

* Any challenges you encountered (e.g., networking, storage) and how you overcame them.
* Any interesting features or configurations you experimented with.

Success is defined as being able to access the Outline instance via `localhost` on your machine.
You are not required to configure persistence or public routing; however, implementing these features will provide excellent talking points for the interview!

> [!CAUTION]
> Please note that the goal is to assess your understanding of raw Kubernetes manifests; therefore, the use of Helm is strictly prohibited for this assessment.

## FAQ

### What do I do if I am stuck, confused, or need clarification?

We have created a dedicated [#platform-technical-assessment](https://discord.gg/UZzqSVdSKp) channel in the [DevSoc Discord](https://discord.gg/6fnHcuFFtz).
If you have any questions, feel free to ask them there and ping @Platforms.

It may take some time for us to respond, so please be patient!
Doing your own research and demonstrating that you have put effort into your question will help us to better understand your thought process.

### I gave the assessment a go, but for the life of me, I cannot get it working. Does this mean I won't get an interview?

Not at all.
If you outline the steps you took, the problems you faced and the solutions you attempted, you do not need a fully functional solution to get an interview.
What we are considering most here is your problem-solving ability and effort, not just technical knowledge.
