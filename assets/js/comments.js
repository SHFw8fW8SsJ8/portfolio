(function(){
  function getPostId(){
    var params = new URLSearchParams(window.location.search);
    return params.get("postId") || params.get("post") || "default";
  }
  function getAnonId(){
    var id = localStorage.getItem("anonId");
    if(!id){
      id = "anon-" + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem("anonId", id);
    }
    return id;
  }
  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function relativeTime(ts){
    try{
      var d = typeof ts === "string" ? new Date(ts) : ts;
      var diff = Date.now() - d.getTime();
      if(!isFinite(diff) || diff < 0) return new Date(ts).toLocaleString();
      var sec = Math.floor(diff/1000);
      var min = Math.floor(sec/60);
      var hr = Math.floor(min/60);
      var day = Math.floor(hr/24);
      if(sec < 10) return "Just now";
      if(sec < 60) return sec + "s ago";
      if(min < 60) return min + "m ago";
      if(hr < 24) return hr + "h ago";
      if(day === 1) return "Yesterday";
      if(day < 7) return day + "d ago";
      return new Date(ts).toLocaleDateString();
    }catch(_){
      return String(ts);
    }
  }
  function updateCount(n){
    var el = document.getElementById("commentsCount");
    if(el){ el.textContent = "Comments (" + n + ")"; }
  }
  function renderComments(list){
    var wrap = document.getElementById("commentsList");
    if(!wrap) return;
    wrap.innerHTML = "";
    if(!list || !list.length){
      var empty = document.createElement("div");
      empty.className = "comment-empty";
      empty.textContent = "No comments yet. Be the first to share your thoughts!";
      wrap.appendChild(empty);
      updateCount(0);
      return;
    }
    list.forEach(function(c){
      var initial = (c.name || "A").slice(0,1).toUpperCase();
      var item = document.createElement("div");
      item.className = "item-box comment-card";
      item.innerHTML = '<div class="flex md:flex-row flex-col">'
        + '<div class="user-img mb-[15px] mr-[30px]">'
        +   '<div class="img circle-60 w-[60px] h-[60px] rounded-full line-height-1 overflow-hidden">'
        +     '<div class="circle-img w-full h-full object-cover object-center bg-[#ffffff1a] flex items-center justify-center text-[24px] rounded-full">' + initial + '</div>'
        +   '</div>'
        + '</div>'
        + '<div class="cont">'
        +   '<h6 class="mb-[10px]">' + escapeHtml(c.name || "Anonymous") + '</h6>'
        +   '<p class="text-[14px] w-[80%]">' + escapeHtml(c.message) + '</p>'
        +   '<div class="meta text-[12px] opacity-60 mt-[5px]">' + relativeTime(c.createdAt) + '</div>'
        + '</div>'
        + '</div>';
      wrap.appendChild(item);
    });
    updateCount(list.length);
  }
  function loadComments(){
    var wrap = document.getElementById("commentsList");
    if(wrap){
      wrap.innerHTML = '<div class="comment-loading">'
        + '<div class="bar"></div>'
        + '<div class="bar"></div>'
        + '<div class="bar"></div>'
        + '</div>';
    }
    var postId = getPostId();
    fetch('/api/comments?postId=' + encodeURIComponent(postId))
      .then(function(r){ return r.json(); })
      .then(function(data){ renderComments((data && data.comments) || []); })
      .catch(function(){ renderComments([]); });
  }
  function bindForm(){
    var form = document.getElementById("comment-form");
    if(!form) return;
    var statusEl = document.getElementById("commentStatus");
    if(!statusEl){
      statusEl = document.createElement("div");
      statusEl.id = "commentStatus";
      statusEl.className = "comment-status info";
      form.appendChild(statusEl);
    }
    function setStatus(type, msg){
      statusEl.className = "comment-status " + type;
      statusEl.textContent = msg || "";
    }
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var nameEl = document.getElementById("form_name");
      var msgEl = document.getElementById("form_message");
      var name = nameEl ? nameEl.value.trim() : "";
      var message = msgEl ? msgEl.value.trim() : "";
      if(name){ localStorage.setItem("commentName", name); }
      if(!message || message.length < 3){
        setStatus("warn", "Please enter at least 3 characters.");
        return;
      }
      var lastTs = parseInt(localStorage.getItem("lastCommentTs") || "0", 10);
      if(Date.now() - lastTs < 5000){
        setStatus("warn", "Please wait a few seconds between comments.");
        return;
      }
      var payload = {
        postId: getPostId(),
        name: name || "Anonymous",
        message: message,
        userId: getAnonId()
      };
      // Optimistically render
      var listWrap = document.getElementById("commentsList");
      var currentItems = listWrap ? listWrap.querySelectorAll('.item-box').length : 0;
      if(listWrap){
        var initial = (payload.name || "A").slice(0,1).toUpperCase();
        var temp = document.createElement("div");
        temp.className = "item-box comment-card";
        temp.innerHTML = '<div class="flex md:flex-row flex-col">'
          + '<div class="user-img mb-[15px] mr-[30px]">'
          +   '<div class="img circle-60 w-[60px] h-[60px] rounded-full line-height-1 overflow-hidden">'
          +     '<div class="circle-img w-full h-full object-cover object-center bg-[#ffffff1a] flex items-center justify-center text-[24px] rounded-full">' + initial + '</div>'
          +   '</div>'
          + '</div>'
          + '<div class="cont">'
          +   '<h6 class="mb-[10px]">' + escapeHtml(payload.name) + '</h6>'
          +   '<p class="text-[14px] w-[80%]">' + escapeHtml(payload.message) + '</p>'
          +   '<div class="meta text-[12px] opacity-60 mt-[5px]">' + 'Just now' + '</div>'
          + '</div>'
          + '</div>';
        listWrap.insertBefore(temp, listWrap.firstChild);
        updateCount(currentItems + 1);
      }
      setStatus("info", "Posting your comment...");
      fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(r){ return r.json(); })
        .then(function(){
          localStorage.setItem("lastCommentTs", Date.now().toString());
          try { form.reset(); } catch(_){}
          setStatus("success", "Your comment has been posted.");
          loadComments();
        })
        .catch(function(){
          setStatus("error", "Failed to post comment. Please try again.");
          // Reload to revert optimistic update if server rejected
          loadComments();
        });
    });
  }
  document.addEventListener("DOMContentLoaded", function(){
    if(document.querySelector(".comments-post")){
      var storedName = localStorage.getItem("commentName");
      var nameEl = document.getElementById("form_name");
      if(nameEl && storedName){ nameEl.value = storedName; }
      loadComments();
      bindForm();
    }
  });
})();