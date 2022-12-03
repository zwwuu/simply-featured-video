!function(){"use strict";var e=window.wp.element,t=window.wp.data,o=window.wp.plugins,l=window.wp.editPost,n=window.wp.i18n,a=window.wp.components,r=window.wp.editor,i=window.lodash;function d(t){let{featuredVideo:o,handleUpdate:l}=t;return(0,e.createElement)("div",null,(0,e.createElement)(a.TextControl,{label:"Video URL",value:o.url,onChange:e=>{l("url",e)}}),(0,e.createElement)(a.TextareaControl,{label:"Caption",value:o.caption,onChange:e=>{l("caption",e)}}))}var s=window.wp.blockEditor;const c=["video"],u=[{value:"auto",label:(0,n.__)("Auto")},{value:"metadata",label:(0,n.__)("Metadata")},{value:"none",label:(0,n.__)("None")}];function m(o){var l;let{featuredVideo:r,handleUpdate:i}=o;const d=null!==(l=sfvEditorData.isPremium)&&void 0!==l&&l,m=(0,t.useSelect)((e=>{const{getMedia:t}=e("core");return r.id>0?t(r.id):null}),[r]),p=e=>{select("core/block-editor").getSettings().mediaUpload({allowedTypes:c,filesList:e,onFileChange(e){let[t]=e;i("id",t.id)}})};return(0,e.createElement)(s.MediaUploadCheck,{fallback:(0,e.createElement)("p",null,(0,n.__)("To edit the featured video, you need permission to upload media."))},(0,e.createElement)(s.MediaUpload,{title:(0,n.__)("Featured video"),onSelect:e=>{console.log(e),i("id",e.id)},allowedTypes:c,value:r,render:t=>{let{open:o}=t;return(0,e.createElement)("div",{className:"editor-simply-featured-video__container"},0===r.id&&(0,e.createElement)("div",{className:"editor-simply-featured-video__dropzone"},(0,e.createElement)(a.Button,{onClick:o,className:"editor-simply-featured-video__toggle"},(0,n.__)("Set featured video")),(0,e.createElement)(a.DropZone,{onFilesDrop:p})),r.id>0&&!m&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("div",{className:"editor-simply-featured-video__dropzone"},(0,e.createElement)(a.Spinner,null),(0,e.createElement)(a.DropZone,{onFilesDrop:p})),(0,e.createElement)(a.Button,{onClick:o,isSecondary:!0},(0,n.__)("Replace video")),(0,e.createElement)(a.Button,{isDestructive:!0,onClick:()=>{i("id",0)}},(0,n.__)("Remove video"))),r.id>0&&m&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("div",null,(0,e.createElement)("video",{controls:!0},(0,e.createElement)("source",{src:m.source_url,type:m.mime_type}))),(0,e.createElement)(a.Button,{onClick:o,isSecondary:!0},(0,n.__)("Replace video")),(0,e.createElement)(a.Button,{isDestructive:!0,onClick:()=>{i("id",0)}},(0,n.__)("Remove video")),d?(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Use featured image as poster"),checked:r.useFeaturedImageAsPoster,onChange:e=>{i("settings.useFeaturedImageAsPoster",e)}}):(0,e.createElement)("p",null,(0,n.__)("Poster setting is only available in Pro.")),(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Autoplay"),checked:r.settings.autoplay,onChange:e=>{i("settings.autoplay",e)}}),(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Loop"),checked:r.settings.loop,onChange:e=>{i("settings.loop",e)}}),(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Muted"),checked:r.settings.muted,onChange:e=>{i("settings.muted",e)}}),(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Playback controls"),checked:r.settings.controls,onChange:e=>{i("settings.controls",e)}}),(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Play inline"),checked:r.settings.playsInline,onChange:e=>{i("settings.playsInline",e)}}),(0,e.createElement)(a.SelectControl,{label:(0,n.__)("Preload"),value:r.settings.preload,onChange:e=>{i("settings.preload",e)},options:u,hideCancelButton:!0})))}}))}const p={useLocal:!1,id:0,url:"",caption:"",useFeaturedImageAsPoster:!1,settings:{autoplay:!1,loop:!1,muted:!1,controls:!0,playsInline:!1,preload:"auto",poster:""}};(0,o.registerPlugin)("plugin-simply-featured-video-panel",{render:()=>{const o=(0,t.useSelect)((e=>{const t=e("core/editor").getEditedPostAttribute("meta").sfv_video;try{const e=JSON.parse(t);return{...p,...e}}catch{return p}}),[]),[s,c]=(0,e.useState)(o),{editPost:u}=(0,t.useDispatch)("core/editor"),g=(e,t)=>{const l=(0,i.set)(o,e,t);u({meta:{sfv_video:JSON.stringify(l)}}),c(l),console.log(`${e}: ${t}`)};return(0,e.createElement)(r.PostTypeSupportCheck,{supportKeys:"custom-fields"},(0,e.createElement)(l.PluginDocumentSettingPanel,{title:(0,n.__)("Featured video")},(0,e.createElement)("div",{className:"editor-simply-featured-video"},(0,e.createElement)(a.ToggleControl,{label:(0,n.__)("Use media library"),help:o.useLocal?(0,n.__)("Set video source from media library."):(0,e.createElement)(e.Fragment,null,`${(0,n.__)("Set video source from url.")} `,(0,e.createElement)(a.ExternalLink,{href:"https://wordpress.org/support/article/embeds/#okay-so-what-sites-can-i-embed-from"},(0,n.__)("See supported video provider."))),checked:o.useLocal,onChange:e=>{g("useLocal",e)}}),o.useLocal?(0,e.createElement)(e.Fragment,null,(0,e.createElement)(m,{featuredVideo:s,handleUpdate:g})):(0,e.createElement)(d,{featuredVideo:s,handleUpdate:g}))))},icon:null})}();