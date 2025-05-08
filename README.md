# Install

```
cd SillyTavern/plugins 
git clone https://github.com/Ares-X/Sillytavern-Random-Image-Server.git
```

# Image File Path

Default: `ST/public/imgpool/`
E.g:
```
ST/public/imgpool/red_apple/1.jpg 
ST/public/imgpool/red_apple/2.jpg 
ST/public/imgpool/red_apple/3.jpg
ST/public/imgpool/blue_banana/1.jpg
```
Change path:
```
//local image file path /ST/public/xxxx
const localImagePath= path.join('public', 'imgpool');
```
# Prompt

Example: 
```
OCC:[Generate a random 3 digital number but don't output. If relevant, Output picture from below image pool when described fruit or {{user}} saw fruit. Always use the most relevant picture. example:If {{char}} give a red apple to {{user}}, then output "red apple" image, if {{user}} saw a "blue banana", then use "blue banana" picture and so on. Important: replace {{url}} with "api/plugins/random-image/rd"]
[
"red apple":![]({{url}}/red_apple?{{lastMessageId}}),
"blue banana":![]({{url}}/blue_banana?{{lastMessageId}}),
]
```
